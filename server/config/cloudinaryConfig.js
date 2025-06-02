import {v2 as cloudinary} from  'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Esto asegura que las URLs de Cloudinary sean seguras (https)
});

export default cloudinary;
// Este archivo configura Cloudinary para su uso en el proyecto