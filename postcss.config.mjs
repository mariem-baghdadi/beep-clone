const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // 2. Ensuite, on le transforme pour les vieux navigateurs
    'postcss-preset-env': {
      stage: 0, // Inclut TOUTES les fonctionnalités, même expérimentales
      browsers: [
        'Android >= 5',      // Cible large pour Android
        'Chrome >= 49',      // Version très ancienne de Chrome
        'last 10 versions',  // Large filet de sécurité
        '> 0.5%'             // Tous les navigateurs utilisés par plus de 0.5% des gens
      ],
      features: {
        // Forcer la transformation de ces fonctionnalités modernes
        'nesting-rules': true,
        'custom-properties': { preserve: true },
        'color-function': true,
        'oklab-function': true,
        'gap-properties': true,  // CRUCIAL pour les flexbox
        'media-query-ranges': true,
      },
      autoprefixer: { grid: true }, // Gère aussi les préfixes CSS
      preserve: false, // Supprime le CSS original pour ne garder que la version compatible
      debug: true,     // ACTIVE LES LOGS pour voir ce qu'il se passe
    },
  },
};

export default config;
