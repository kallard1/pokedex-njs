module.exports = {
  plugins: (loader) => [
    require('autoprefixer')({
        'browsers': [
          'last 5 versions',
          'safari >= 7',
        ],
      },
    ),
  ],
};
