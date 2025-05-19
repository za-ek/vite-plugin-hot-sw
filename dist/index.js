import { execSync } from 'child_process';
import path from "path";
import * as os from "os";
import * as fs from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from "assert";
export const serviceWorkerBuild = function () {
    const __plugin_name = 'vite-plugin-build-sw';
    return {
        name: __plugin_name,
        enforce: 'pre',
    };
};
export default function hotServiceWorkerPlugin(instanceOptions = {}) {
    const confID = JSON.stringify(instanceOptions).split("").map(c => c.charCodeAt(0)).reduce((ps, a) => ps + a, 0);
    const __plugin_name = 'vite-plugin-hot-sw';
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const conf = {
        serviceWorkerFileName: path.join('src', 'service-worker.ts'),
        buildDir: __dirname,
        targetFile: path.join('public', 'service-worker.js'),
        configFile: path.resolve(__dirname, confID + '-vite-sw.config.tmp.js'),
    };
    const hotCopy = (rootDir) => {
        return new Promise((resolve, reject) => {
            const copyTarget = path.join(rootDir, conf.targetFile);
            fs.copyFile(path.join(conf.buildDir, 'service-worker.js'), copyTarget, (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.warn(`[${__plugin_name}] Couldn't create a target. Check if directory exists: ${copyTarget}`);
                        reject(`[${__plugin_name}] Couldn't create a target. Check if directory exists: ${copyTarget}`);
                    }
                    else {
                        reject();
                    }
                }
                else {
                    resolve();
                }
            });
        });
    };
    const doMake = () => {
        execSync('vite build -c "' + conf.configFile + '" --outDir="' + conf.buildDir + '"');
    };
    const doHotMake = (server) => {
        doMake();
        hotCopy(server.config.root).then(() => {
            server.ws.send({ type: "full-reload", path: "*" });
        });
    };
    const injectAssets = (assets, serviceWorkerPath) => {
        try {
            let content = fs
                .readFileSync(serviceWorkerPath, 'utf-8')
                .replace('self.__CUSTOM_MANIFEST', JSON.stringify(assets, null, 2))
                .replace('"use strict";', '"use strict";var exports = {};');
            Object.keys(process.env).forEach((key) => {
                if (process.env[key] !== undefined) {
                    if (['true', 'false'].indexOf(process.env[key]) > -1) {
                        content = content.replace('import.meta.env.' + key, `${process.env[key]}`);
                    }
                    else {
                        content = content.replace('import.meta.env.' + key, `"${process.env[key]}"`);
                    }
                }
            });
            fs.writeFileSync(serviceWorkerPath, content);
        }
        catch (e) { }
    };
    const prepareConfig = (configFile, serviceWorkerFileName) => {
        const confContent = fs.readFileSync(path.resolve(__dirname, 'vite-sw.config.js')).toString();
        fs.writeFileSync(configFile, confContent.replace('#SERVICE_WORKER_FILE_NAME#', path.join('.', serviceWorkerFileName).replace(/[\\$'"]/g, "\\$&")));
    };
    return {
        name: __plugin_name,
        enforce: 'post',
        config() {
            if (instanceOptions.buildDirectory) {
                conf.buildDir = instanceOptions.buildDirectory;
            }
            else {
                fs.mkdtemp(path.join(os.tmpdir(), 'hotsw-'), (err, folder) => {
                    if (!err) {
                        conf.buildDir = folder;
                    }
                });
            }
            if (instanceOptions.targetFile) {
                conf.targetFile = instanceOptions.targetFile;
            }
            if (instanceOptions.serviceWorkerFileName) {
                conf.serviceWorkerFileName = instanceOptions.serviceWorkerFileName;
            }
        },
        configureServer(server) {
            prepareConfig(conf.configFile, conf.serviceWorkerFileName);
            doHotMake(server);
        },
        async writeBundle(options, bundle) {
            assert(options.dir !== undefined);
            prepareConfig(conf.configFile, conf.serviceWorkerFileName);
            doMake();
            await hotCopy(path.resolve(options.dir, '..'));
            const assets = (instanceOptions.customAssets || []);
            for (const [fileName] of Object.entries(bundle)) {
                if (fileName.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|js|css)$/)) {
                    assets.push(fileName);
                }
            }
            const swPath = path.join(options.dir, 'service-worker.js');
            injectAssets(assets, swPath);
        },
        handleHotUpdate({ file, server }) {
            if (file.includes(conf.serviceWorkerFileName)) {
                doHotMake(server);
            }
        },
    };
}
//# sourceMappingURL=index.js.map