import { execSync } from 'child_process';
import path from "path";
export default function hotServiceWorkerPlugin(options = {}) {
    const conf = {
        buildConfigPath: path.resolve(__dirname, 'vite-sw.config.js'),
        serviceWorkerFileName: 'service-worker.ts',
    };
    return {
        name: 'vite-plugin-hot-sw',
        enforce: 'post',
        config(config) {
            if (options.buildConfigPath) {
                conf.buildConfigPath = options.buildConfigPath;
            }
        },
        handleHotUpdate({ file, server }) {
            if (file.includes(conf.serviceWorkerFileName)) {
                execSync('vite build -c ' + conf.buildConfigPath, { stdio: 'inherit' });
                server.ws.send({ type: "full-reload", path: "*" });
            }
        },
    };
}
//# sourceMappingURL=index.js.map