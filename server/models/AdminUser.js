const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Por favor, introduce un email válido.']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres.']
  },
  // Podrías añadir un campo 'name' o 'role' si lo necesitas en el futuro
  // name: {
  //   type: String,
  //   trim: true
  // },
  // role: {
  //   type: String,
  //   default: 'admin'
  // }
}, { timestamps: true });

// Middleware para hashear la contraseña ANTES de guardarla
adminUserSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generar un salt
    this.password = await bcrypt.hash(this.password, salt); // Hashear la contraseña
    next();
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware/manejador
  }
});

// Método para comparar la contraseña ingresada con la hasheada en la BD
adminUserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;