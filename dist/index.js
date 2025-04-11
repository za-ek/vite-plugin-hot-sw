import { execSync } from 'child_process';
import path from "path";
import * as os from "os";
import * as fs from "fs";
export default function hotServiceWorkerPlugin(options = {}) {
    const conf = {
        serviceWorkerFileName: 'service-worker.ts',
        buildDir: '',
        targetFile: '/public/service-worker.js'
    };
    const doMake = (server) => {
        execSync('vite build -c ' + path.resolve(import.meta.dirname, 'vite-sw.config.js') + ' --outDir=' + conf.buildDir, { stdio: 'inherit' });
        execSync('cp ' + conf.buildDir + '/service-worker.js ' + server.config.root + conf.targetFile);
        server.ws.send({ type: "full-reload", path: "*" });
    };
    return {
        name: 'vite-plugin-hot-sw',
        enforce: 'post',
        config(config) {
            if (options.buildDirectory) {
                conf.buildDir = options.buildDirectory;
            }
            else {
                fs.mkdtemp(path.join(os.tmpdir(), 'hotsw-'), (err, folder) => {
                    if (!err) {
                        conf.buildDir = folder;
                    }
                });
            }
            if (options.targetFile) {
                conf.targetFile = options.targetFile;
            }
        },
        configureServer(server) {
            doMake(server);
        },
        handleHotUpdate({ file, server }) {
            if (file.includes(conf.serviceWorkerFileName)) {
                doMake(server);
            }
        },
    };
}
//# sourceMappingURL=index.js.map