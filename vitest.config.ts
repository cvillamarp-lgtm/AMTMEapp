import { defineConfig } from 'vitest/config';
<<<<<<< HEAD
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
=======

export default defineConfig({
  test: {
    environment: 'node', // pure types + lib code for now
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/**', 'dist/**', '**/*.test.*'],
    },
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)
  },
});
