import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: './src/service-worker.ts',
            name: 'service-worker',
            fileName: () => `service-worker.js`,
        },
        rollupOptions: {
            external: [],
            output: {
                preserveModules: false,
                format: 'cjs',
                inlineDynamicImports: true,
            },
        },
        minify: true,
        emptyOutDir: true,
        sourcemap: false,
    },
    optimizeDeps: {
        include: ['src/service-worker.ts'],
    },
    define: {
        'process.env': {},
    },
});
