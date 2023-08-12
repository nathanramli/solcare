import { defineConfig, loadEnv, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import inject from '@rollup/plugin-inject';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import compressPlugin from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import path from 'node:path';

export function parseEnv(env: Record<string, string>) {
  const parsedEnv: Record<string, unknown> = { ...env };

  Object.entries(env).forEach(([key, value]) => {
    if (value == 'true' || value == 'false') parsedEnv[key] = value == 'true' ? true : false;
    else if (/^\d+$/.test(value)) parsedEnv[key] = Number(value);
    else if (value == 'null') parsedEnv[key] = null;
    else if (value == 'undefined') parsedEnv[key] = undefined;
  });
  return parsedEnv;
}

export default defineConfig(({ command, mode }) => {
  const env = parseEnv(loadEnv(mode, process.cwd(), ''));
  const plugins: PluginOption = [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
    }),
    chunkSplitPlugin({
      strategy: 'default',
    }),
  ];

  if (command == 'build') {
    if (env.VITE_PLUGIN_LEGACY === true) {
      plugins.push(
        legacy({
          targets: ['> 1%', 'last 2 versions', 'not dead', 'not IE 11'],
        })
      );
    }
    if (env.VITE_PLUGIN_COMPRESS === true) {
      plugins.push(
        compressPlugin({
          verbose: false,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        })
      );
    }
  }

  return {
    server: {
      port: env.VITE_SERVER_PORT as number,
    },
    preview: {
      port: env.VITE_PREVIEW_PORT as number,
    },
    plugins: plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        https: 'rollup-plugin-node-polyfills/polyfills/http',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        assert: 'assert',
        crypto: 'crypto-browserify',
        util: 'util',
        buffer: 'buffer',
      },
    },
    build: {
      base: env.VITE_PUBLIC_PATH,
      target: 'esnext',
      outDir: 'build',
      minify: mode === 'production' ? true : false,
      sourcemap: mode === 'production' ? false : true,
      chunkSizeWarningLimit: 3000,
      commonjsOptions: {
        transformMixedEsModules: true,
        strictRequires: [/\@metaplex\-foundation\/js/],
      },
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer', 'Buffer'] }), nodePolyfills({ crypto: true })],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    define: {
      // global: "globalThis",
      'process.env': Object.assign(process.env ?? {}, env),
    },
  };
});
