const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs'); // Asegúrate de que bcrypt está instalado
const dotenv = require('dotenv');
const path = require('path'); // Para asegurar la ruta correcta al .env

// Cargar variables de entorno desde server/.env
// __dirname es la carpeta actual del script (server/scripts)
// path.resolve une los segmentos de ruta de forma correcta para cualquier OS
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
      process.exit(1); // Salir si la URI no está
    }

    // Mostrar parte de la URI para depuración (sin credenciales si están en la URI)
    let DBUriToShow = dbUri;
    if (dbUri.includes('@')) {
        DBUriToShow = `mongodb+srv://${dbUri.substring(dbUri.indexOf('@'))}`;
    }
    console.log(`Intentando conectar a MongoDB con URI que comienza con: ${DBUriToShow.substring(0,30)}...`);

    await mongoose.connect(dbUri); // Mongoose 6+ no necesita las opciones deprecadas

    console.log('MongoDB Conectado para el seeder.');
  } catch (err) {
    console.error('Error de conexión a MongoDB (seeder):', err.message);
    // console.error('Stack trace del error de conexión:', err.stack); // Descomentar para más detalles si es necesario
    process.exit(1); // Salir si la conexión falla
  }
};

const seedAdminUser = async () => {
  await connectDB();

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
      mongoose.disconnect(); // Desconectar antes de salir
      process.exit(1);
    }

    const existingAdmin = await AdminUser.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`El usuario administrador con email ${adminEmail} ya existe.`);
    } else {
      const adminUser = new AdminUser({
        email: adminEmail,
        password: adminPassword, // El modelo se encarga del hasheo
      });
      await adminUser.save();
      console.log(`Usuario administrador creado con email: ${adminEmail}`);
      console.log(
        'IMPORTANTE: La contraseña guardada está hasheada. La contraseña original es:',
        adminPassword
      );
    }
  } catch (error) {
    console.error('Error al sembrar el usuario administrador:', error.message);
    // console.error('Stack trace del error de seeding:', error.stack); // Descomentar para más detalles
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Desconectado (seeder).');
    // No es necesario process.exit() aquí si todo fue bien, el script terminará.
  }
};

seedAdminUser().catch((err) => {
  // Captura errores no manejados en la promesa principal de seedAdminUser
  console.error('Error fatal no manejado en seedAdminUser:', err);
  // Asegurarse de que mongoose se desconecte si aún está conectado
  if (mongoose.connection.readyState === 1) { // 1 === connected
    mongoose.disconnect().then(() => process.exit(1)).catch(() => process.exit(1));
  } else {
    process.exit(1);
  }
});