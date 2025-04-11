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
4. When you use this plugin with default configuration it will override service-worker.js file in dist directory, so if you make changes in service-worker.ts file after build it will be overwritten in /dist/service-worker.js

## Parameters

Option | Type   | Default | Description 
--- |--------|---  | --- 
`buildConfigPath` | string | - | The internal configuration file is used by default 
`serviceWorkerFileName` | string | service-worker.ts | filename for watch changes


## Example configuration
```ts
import hotServiceWorker from'vite-plugin-hot-sw'

export default defineConfig({
    plugins: [
        hotServiceWorker({
            buildConfigPath: path.resolve(__dirname, 'vite-sw.config.ts'),
            serviceWorkerFileName: 'sw.ts',
        }),
    ],
})
```