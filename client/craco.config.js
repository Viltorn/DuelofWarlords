const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@slices': path.resolve(__dirname, './src/slices'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
};
