module.exports = {
  presets: [
    ['@4c', { target: 'node', exclude: ['proposal-dynamic-import'] }],
    '@babel/preset-typescript',
  ],
};
