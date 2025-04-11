import { PluginOption } from 'vite';
export type HotServiceWorkerOptions = {
    buildConfigPath?: string;
    serviceWorkerFileName?: string;
    buildDirectory?: string;
    targetDirectory?: string;
};
export default function hotServiceWorkerPlugin(options?: HotServiceWorkerOptions): PluginOption;
