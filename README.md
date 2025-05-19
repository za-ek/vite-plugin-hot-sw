# vite-plugin-hot-sw
Isolate build for service-worker

https://github.com/za-ek/vite-plugin-hot-sw/

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

| Option                  | Type     | Default                   | Description                                        | 
|-------------------------|----------|---------------------------|----------------------------------------------------|
| `serviceWorkerFileName` | string   | service-worker.ts         | Filename for compile relative to /src              |
| `targetFile`            | string   | /public/service-worker.js | Filename of output script relative to project root |
| `buildDirectory`        | string   | tmp directory             | Directory where to store provisional build         |
| `customAssets`          | string[] | []                        | Files to be included in the assets list            |


## Example configuration
```ts
import hotServiceWorker from'vite-plugin-hot-sw'

export default defineConfig({
    plugins: [
        hotServiceWorker({
            serviceWorkerFileName: 'sw.ts',
            targetFile: '/public/sw.js',
            buildDirectory: path.resolve(__dirname, 'dist-sw'),
            customAssets: ['api/to_be_cached'],
        }),
    ],
})
```

You can use multiple builders for different environments:
```ts
export default defineConfig({
    plugins: [
        hotServiceWorker(),
        hotServiceWorker({targetFile: '/dist/sw.js',}),
    ],
})
```

# To inject build assets
```
const manifest = self.__CUSTOM_MANIFEST || [];
```
The variable self.__CUSTOM_MANIFEST (as is, not as self['__CUSTOM_MANIFEST']) will be replaced with an array