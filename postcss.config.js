// postcss.config.js
module.exports = {
  plugins: {
    // Importa primero si usás @import en CSS (opcional, pero inofensivo)
    'postcss-import': {},
    // Tailwind siempre antes que autoprefixer
    tailwindcss: {},
    autoprefixer: {},
  },
};