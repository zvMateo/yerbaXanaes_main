import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js'; // Asegúrate que AdminUser.js use export default
// import bcrypt from 'bcryptjs'; // No es necesario importar bcrypt aquí si el modelo se encarga del hasheo
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env en la carpeta 'server'
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error(
        'Error Crítico: MONGODB_URI no está definida en tus variables de entorno.'
      );
      console.error(
        'Asegúrate de tener un archivo .env en la carpeta "server" (al mismo nivel que package.json)'
      );
      console.error('y que contenga la línea: MONGODB_URI="tu_uri_de_conexion_mongodb"');
      process.exit(1);
    }

    // Opcional: Mostrar parte de la URI para depuración (sin credenciales)
    let DBUriToShow = dbUri;
    if (dbUri.includes('@') && dbUri.startsWith('mongodb')) { // Chequeo más robusto
        const protocolEnd = dbUri.indexOf('://') + 3;
        const credentialsEnd = dbUri.indexOf('@', protocolEnd);
        if (credentialsEnd > protocolEnd) {
            DBUriToShow = `${dbUri.substring(0, protocolEnd)}<credentials_hidden>${dbUri.substring(credentialsEnd)}`;
        }
    }
    console.log(`Intentando conectar a MongoDB con URI: ${DBUriToShow.substring(0,80)}...`); // Mostrar un poco más

    await mongoose.connect(dbUri);

    console.log('MongoDB Conectado para el seeder.');
  } catch (err) {
    console.error('Error de conexión a MongoDB (seeder):', err.message);
    // console.error('Stack trace del error de conexión:', err.stack); // Descomentar para más detalles
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  await connectDB(); // Conectar a la base de datos primero

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        'Error Crítico: ADMIN_EMAIL o ADMIN_PASSWORD no están definidos en tu archivo .env.'
      );
      console.error(
        'Asegúrate de que tu archivo .env (en la carpeta "server") contenga estas líneas:'
      );
      console.error('ADMIN_EMAIL="tu_email_admin"');
      console.error('ADMIN_PASSWORD="tu_password_admin"');
      // No es necesario desconectar mongoose aquí si connectDB falló y ya hizo process.exit()
      // o si esta validación ocurre antes de una conexión exitosa.
      process.exit(1); // Salir si las credenciales no están
    }

    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`El usuario administrador con email ${adminEmail} ya existe.`);
    } else {
      // El pre-save hook en AdminUser.js se encargará de hashear la contraseña
      const adminUser = new AdminUser({
        email: adminEmail,
        password: adminPassword,
      });
      await adminUser.save();
      console.log(`Usuario administrador creado con email: ${adminEmail}`);
      console.log(
        'IMPORTANTE: La contraseña guardada está hasheada. La contraseña original para el login es:',
        adminPassword // Mostrar la contraseña original es útil para el primer login
      );
    }
  } catch (error) {
    console.error('Error al sembrar el usuario administrador:', error.message);
    // console.error('Stack trace del error de seeding:', error.stack);
  } finally {
    // Asegurarse de desconectar mongoose solo si está conectado
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) { // 1: connected, 2: connecting
        await mongoose.disconnect();
        console.log('MongoDB Desconectado (seeder).');
    }
  }
};
// Ejecutar la función de seeder
seedAdminUser()
  .then(() => {
    console.log('Proceso de seeder completado.');
    // process.exit(0); // Opcional: Salir explícitamente con código 0 si todo fue bien
  })
  .catch((err) => {
    console.error('Error fatal no manejado durante la ejecución de seedAdminUser:', err.message);
    // console.error('Stack trace del error fatal:', err.stack);

    // Intenta desconectar si aún está conectado antes de salir con error
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      mongoose.disconnect()
        .then(() => process.exit(1))
        .catch(() => process.exit(1)); // Si la desconexión también falla, salir
    } else {
      process.exit(1); // Salir con código de error
    }
  });