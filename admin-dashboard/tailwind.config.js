/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapea los nombres de tus clases de Tailwind a las variables CSS
        // La sintaxis `rgb(var(--nombre-variable) / <alpha-value>)` permite opacidad.
        'primary': 'rgb(var(--primary-color) / <alpha-value>)',
        'secondary': 'rgb(var(--secondary-color) / <alpha-value>)',
        'accent': 'rgb(var(--accent-color) / <alpha-value>)',
        'text-main': 'rgb(var(--text-color) / <alpha-value>)', // Para clases como text-text-main
        'dark-tone': 'rgb(var(--dark-color) / <alpha-value>)', // Renombrado para evitar conflicto con text-dark
        'warm-tone': 'rgb(var(--warm-color) / <alpha-value>)',

        // Si quieres usar los nombres "yrbx-..." en tus clases JSX, puedes mapearlos así:
        'yrbx-orange': 'rgb(var(--accent-color) / <alpha-value>)',
        'yrbx-brown': 'rgb(var(--warm-color) / <alpha-value>)',
        'yrbx-green-dark': 'rgb(var(--primary-color) / <alpha-value>)',
        'yrbx-green-olive': 'rgb(var(--secondary-color) / <alpha-value>)',
        'yrbx-green-forest': 'rgb(var(--dark-color) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}