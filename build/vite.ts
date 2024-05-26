import { resolve } from "path";
import viteChecker from "vite-plugin-checker";
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from "vite";
import { OutputChunk } from "rollup";
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html'

import {
  quasar,
  transformAssetUrls
} from '@quasar/vite-plugin';

export function getConfig(consts: { IS_DEBUG?: boolean, PUBLIC_PATH?: string, PORT?: number, VUE_DEVTOOL: boolean }) {
  if (consts.IS_DEBUG) {
    // enable vue devtools support if DEBUG is on
    process.env.NODE_ENV = 'development';
  }
  const srcDir = resolve(__dirname, '..', 'src');
  return {
    resolve: {
      alias: [
        { find: '@', replacement: srcDir },
      ],
    },
    ...(consts.PUBLIC_PATH ? { base: consts.PUBLIC_PATH } : null),
    root: srcDir,
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/sass/component-variables.scss";
          `,
        },
      },
    },
    plugins: [
      vue({
        template: { transformAssetUrls },
        script: {
          defineModel: true,
        }
      }),
      createHtmlPlugin({
        minify: !consts.IS_DEBUG,
        entry: '/ts/vue.ts',
        template: 'assets/index.html',
        ...(consts.VUE_DEVTOOL && {
          inject: {
            tags: [{
              injectTo: 'head',
              tag: 'script',
              attrs: {
                src: consts.VUE_DEVTOOL,
              },
            }]
          }
        })
      }),
      quasar({
        sassVariables: 'src/assets/sass/quasar-variables.scss'
      }),
      viteChecker({
        typescript: true,
        vueTsc: true,
      }),
      ...consts.IS_DEBUG ? [] : [viteCompression({
        filter: () => true,
      })],
      splitVendorChunkPlugin(),
    ],
    build: {
      emptyOutDir: true,
      assetsInlineLimit: 0,
      minify: !consts.IS_DEBUG,
      outDir: resolve(__dirname, '..', 'dist'),
      sourcemap: consts.IS_DEBUG,
      modulePreload: {
        resolveDependencies: (filename, deps, { hostId, hostType }) => {
          return deps.filter(a => !a.includes('js/dev')); // do not preload dev pages for prod
        }
      },
      rollupOptions: {
        input: {
          index: resolve(srcDir, 'index.html'), //index should be inside src, otherwise vite won't return it by default
        },
        output: {
          manualChunks(id,) {
            // this configuration provides output
            // 2.6K dev-cbe5773e.js.gz - will increase with more features
            // 14K index-57dc7880.js.gz - will increase with more features
            // 29K quasar-c990e936.js.gz
            // 30K vendor-ce64e522.js.gz
            // 26K vue-79415e32.js.gz
            if (id.includes('src/vue/pages/dev')) {
              return 'dev';
            } else if (id.includes('node_modules/quasar')) {
              return 'quasar'
            } else if (id.includes('node_modules/@vue')) {
              return 'vue'
            }
          },
          assetFileNames: (assetInfo) => {
            let dirName = '';
            if (/\.(mp3|wav)$/.test(assetInfo.name!)) {
              dirName = `sounds/`;
            } else if (/((fonts?\/.*\.svg)|(\.(woff2?|eot|ttf|otf)))(\?.*)?/.test(assetInfo.name!)) {
              dirName = `font/`;
            } else if (/\.(png|jpg|svg|gif|webp|ico)$/.test(assetInfo.name!)) {
              dirName = `img/`;
            } else if (/\.css$/.test(assetInfo.name!)) {
              dirName = `css/`;
            }
            return `${dirName}[name]-[hash].[ext]`
          },
          chunkFileNames(assetInfo: OutputChunk) {
            return 'js/[name]-[hash].js';
          },
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
    },
    server: {
      port: consts.PORT,
    },
    define: {
      APP_CONSTS: JSON.stringify(consts)
    }
  }
}
