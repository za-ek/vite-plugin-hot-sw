import { PluginOption } from 'vite';
export type HotServiceWorkerOptions = {
    serviceWorkerFileName?: string;
    buildDirectory?: string;
    targetFile?: string;
};
export default function hotServiceWorkerPlugin(options?: HotServiceWorkerOptions): PluginOption;
