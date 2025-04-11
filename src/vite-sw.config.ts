import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: '#SERVICE_WORKER_FILE_NAME#',
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
