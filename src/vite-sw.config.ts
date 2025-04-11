import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: './src/service-worker.ts',
            name: 'service-worker',
            fileName: (format) => `service-worker.js`,
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
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, './dist') + '/service-worker.js',
                    dest: path.resolve(__dirname, './public'),
                },
            ],
        }),
    ],
    optimizeDeps: {
        include: ['src/service-worker.ts'],
    },
    define: {
        'process.env': {},
    },
});
