module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@vrumm/ui-tokens': '../Vrummm-Backend/packages/ui-tokens/src/index.js',
            '@vrumm/contracts': '../Vrummm-Backend/packages/contracts/src/index.js',
          },
        },
      ],
    ],
  };
};
