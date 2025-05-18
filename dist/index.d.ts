import { PluginOption } from 'vite';
export type HotServiceWorkerOptions = {
    serviceWorkerFileName?: string;
    buildDirectory?: string;
    targetFile?: string;
    customAssets?: string[];
};
export declare const serviceWorkerBuild: () => {
    name: string;
    enforce: string;
};
export default function hotServiceWorkerPlugin(instanceOptions?: HotServiceWorkerOptions): PluginOption;
