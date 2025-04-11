import {PluginOption, ViteDevServer} from 'vite';
import { execSync } from 'child_process';
import path from "path";
import * as os from "os";
import * as fs from "fs";

export type HotServiceWorkerOptions = {
    serviceWorkerFileName?: string
    buildDirectory?: string
    targetFile?: string
}

export default function hotServiceWorkerPlugin(options: HotServiceWorkerOptions = {}): PluginOption {
    const conf = {
        serviceWorkerFileName: 'service-worker.ts',
        buildDir: import.meta.dirname,
        targetFile: '/public/service-worker.js'
    };

    const doMake = (server: ViteDevServer) => {
        execSync('vite build -c ' + path.resolve(import.meta.dirname, 'vite-sw.config.tmp.js') + ' --outDir=' + conf.buildDir, { stdio: 'inherit' });
        execSync('cp ' + conf.buildDir + '/service-worker.js ' + server.config.root + conf.targetFile)
        server.ws.send({ type: "full-reload", path: "*" });
    }

    return {
        name: 'vite-plugin-hot-sw',
        enforce: 'post',
        config() {
            if(options.buildDirectory) {
                conf.buildDir = options.buildDirectory;
            } else {
                fs.mkdtemp(path.join(os.tmpdir(), 'hotsw-'), (err, folder) => {
                    if (!err) {
                        conf.buildDir = folder;
                    }
                });
            }

            if(options.targetFile) {
                conf.targetFile = options.targetFile;
            }

            if(options.serviceWorkerFileName) {
                conf.serviceWorkerFileName = options.serviceWorkerFileName;
            }
        },
        configureServer(server) {
            const confContent = fs.readFileSync(path.resolve(import.meta.dirname, 'vite-sw.config.js')).toString()
            fs.writeFileSync(
                path.resolve(import.meta.dirname, 'vite-sw.config.tmp.js'),
                confContent.replace('#SERVICE_WORKER_FILE_NAME#', './src/' + conf.serviceWorkerFileName)
            )
            doMake(server);
        },
        handleHotUpdate({ file, server }) {
            if (file.includes('src/' + conf.serviceWorkerFileName)) {
                doMake(server);
            }
        },
    };
}
