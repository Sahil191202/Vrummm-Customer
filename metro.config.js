const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Monorepo support: include packages folder
const packagesRoot = path.resolve(__dirname, '../Vrummm-Backend/packages');
config.watchFolders = [packagesRoot];

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, './src'),
  '@vrumm/ui-tokens': path.resolve(__dirname, '../Vrummm-Backend/packages/ui-tokens/src/index.js'),
  '@vrumm/contracts': path.resolve(__dirname, '../Vrummm-Backend/packages/contracts/src/index.js'),
};

module.exports = config;
