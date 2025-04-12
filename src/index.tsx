import {PluginOption, ViteDevServer} from 'vite';
import { execSync } from 'child_process';
import path from "path";
import * as os from "os";
import * as fs from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type HotServiceWorkerOptions = {
    serviceWorkerFileName?: string
    buildDirectory?: string
    targetFile?: string
}

export default function hotServiceWorkerPlugin(options: HotServiceWorkerOptions = {}): PluginOption {
    const confID = JSON.stringify(options).split("").map(c => c.charCodeAt(0)).reduce((ps, a) => ps + a, 0)

    const __plugin_name = 'vite-plugin-hot-sw';
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const conf = {
        serviceWorkerFileName: path.join('src', 'service-worker.ts'),
        buildDir: __dirname,
        targetFile: path.join('public', 'service-worker.js'),
        configFile: path.resolve(__dirname, confID + '-vite-sw.config.tmp.js'),
    };

    const doMake = (server: ViteDevServer) => {
        execSync('vite build -c ' + conf.configFile + ' --outDir=' + conf.buildDir);
        const copyTarget = path.join(server.config.root, conf.targetFile);
        fs.copyFile(path.join(conf.buildDir, 'service-worker.js'), copyTarget, (err) => {
            if (err) {
                if(err.code === 'ENOENT') {
                    console.warn(`[${__plugin_name}] Couldn't create a target. Check if directory exists: ${copyTarget}`);
                } else {
                    throw err;
                }
            } else {
                server.ws.send({ type: "full-reload", path: "*" });
            }
        });
    }

    return {
        name: __plugin_name,
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
            const confContent = fs.readFileSync(path.resolve(__dirname, 'vite-sw.config.js')).toString()
            fs.writeFileSync(
                conf.configFile,
                confContent.replace('#SERVICE_WORKER_FILE_NAME#', path.join('.', conf.serviceWorkerFileName).replace(/[\\$'"]/g, "\\$&"))
            )
            doMake(server);
        },
        handleHotUpdate({ file, server }) {
            if (file.includes(conf.serviceWorkerFileName)) {
                doMake(server);
            }
        },
    };
}
