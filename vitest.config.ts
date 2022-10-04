import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      exclude: ['src/**/*.{types,mock,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    sequence: {
      shuffle: true,
    },
  },
});
