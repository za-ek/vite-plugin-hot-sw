# vite-plugin-hot-sw

Isolate build for service-worker

## When should I use this plugin

When you want to debug service-worker in hot-reload mode


## Quick start

1. Install dependencies
```sh
npm i vite-plugin-hot-sw -D
yarn add vite-plugin-hot-sw -D
```

2. Configure vite

```ts
import hotServiceWorker from'vite-plugin-isolated-hot-build'

export default defineConfig({
    plugins: [hotServiceWorker()]
})
```

3. The plugin will watch on /src/service-worker.ts file by default

## Parameters

| Option                  | Type   | Default                   | Description | 
|-------------------------|--------|---------------------------| --- |
| `serviceWorkerFileName` | string | service-worker.ts         | Filename filter for hot-reload|
| `targetFile`            | string | /public/service-worker.js | Filename of output script relative to project root|
| `buildDirectory`        | string | tmp directory             | Directory where to store provisional build |


## Example configuration
```ts
import hotServiceWorker from'vite-plugin-hot-sw'

export default defineConfig({
    plugins: [
        hotServiceWorker({
            serviceWorkerFileName: 'sw.ts',
            targetFile: '/public/sw.js',
            buildDirectory: path.resolve(__dirname, 'dist-sw'),
        }),
    ],
})
```