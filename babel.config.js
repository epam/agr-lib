export default {
  ignore: ['src/**/*.spec.ts'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        modules: 'auto',
      },
    ],
  ],
};
