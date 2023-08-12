// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Skripsi/Website/Solcare/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Skripsi/Website/Solcare/node_modules/@vitejs/plugin-react/dist/index.mjs";
import legacy from "file:///D:/Skripsi/Website/Solcare/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import inject from "file:///D:/Skripsi/Website/Solcare/node_modules/@rollup/plugin-inject/dist/index.js";
import nodePolyfills from "file:///D:/Skripsi/Website/Solcare/node_modules/rollup-plugin-node-polyfills/dist/index.js";
import compressPlugin from "file:///D:/Skripsi/Website/Solcare/node_modules/vite-plugin-compression/dist/index.mjs";
import { VitePWA } from "file:///D:/Skripsi/Website/Solcare/node_modules/vite-plugin-pwa/dist/index.mjs";
import { chunkSplitPlugin } from "file:///D:/Skripsi/Website/Solcare/node_modules/vite-plugin-chunk-split/dist/index.js";
import path from "node:path";
var __vite_injected_original_dirname = "D:\\Skripsi\\Website\\Solcare";
function parseEnv(env) {
  const parsedEnv = { ...env };
  Object.entries(env).forEach(([key, value]) => {
    if (value == "true" || value == "false")
      parsedEnv[key] = value == "true" ? true : false;
    else if (/^\d+$/.test(value))
      parsedEnv[key] = Number(value);
    else if (value == "null")
      parsedEnv[key] = null;
    else if (value == "undefined")
      parsedEnv[key] = void 0;
  });
  return parsedEnv;
}
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = parseEnv(loadEnv(mode, process.cwd(), ""));
  const plugins = [
    react(),
    VitePWA({
      registerType: "autoUpdate"
    }),
    chunkSplitPlugin({
      strategy: "default"
    })
  ];
  if (command == "build") {
    if (env.VITE_PLUGIN_LEGACY === true) {
      plugins.push(
        legacy({
          targets: ["> 1%", "last 2 versions", "not dead", "not IE 11"]
        })
      );
    }
    if (env.VITE_PLUGIN_COMPRESS === true) {
      plugins.push(
        compressPlugin({
          verbose: false,
          disable: false,
          threshold: 10240,
          algorithm: "gzip",
          ext: ".gz"
        })
      );
    }
  }
  return {
    server: {
      port: env.VITE_SERVER_PORT
    },
    preview: {
      port: env.VITE_PREVIEW_PORT
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src"),
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        events: "rollup-plugin-node-polyfills/polyfills/events",
        querystring: "rollup-plugin-node-polyfills/polyfills/qs",
        url: "rollup-plugin-node-polyfills/polyfills/url",
        https: "rollup-plugin-node-polyfills/polyfills/http",
        path: "rollup-plugin-node-polyfills/polyfills/path",
        zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
        assert: "assert",
        crypto: "crypto-browserify",
        util: "util",
        buffer: "buffer"
      }
    },
    build: {
      base: env.VITE_PUBLIC_PATH,
      target: "esnext",
      outDir: "build",
      minify: mode === "production" ? true : false,
      sourcemap: mode === "production" ? false : true,
      chunkSizeWarningLimit: 3e3,
      commonjsOptions: {
        transformMixedEsModules: true,
        strictRequires: [/\@metaplex\-foundation\/js/]
      },
      rollupOptions: {
        plugins: [inject({ Buffer: ["buffer", "Buffer"] }), nodePolyfills({ crypto: true })]
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext"
      }
    },
    define: {
      global: {},
      "process.env": Object.assign(process.env ?? {}, env)
    }
  };
});
export {
  vite_config_default as default,
  parseEnv
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxTa3JpcHNpXFxcXFdlYnNpdGVcXFxcU29sY2FyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcU2tyaXBzaVxcXFxXZWJzaXRlXFxcXFNvbGNhcmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Nrcmlwc2kvV2Vic2l0ZS9Tb2xjYXJlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knO1xyXG5pbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCc7XHJcbmltcG9ydCBub2RlUG9seWZpbGxzIGZyb20gJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnO1xyXG5pbXBvcnQgY29tcHJlc3NQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuaW1wb3J0IHsgY2h1bmtTcGxpdFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWNodW5rLXNwbGl0JztcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUVudihlbnY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICBjb25zdCBwYXJzZWRFbnY6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0geyAuLi5lbnYgfTtcclxuXHJcbiAgT2JqZWN0LmVudHJpZXMoZW52KS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgIGlmICh2YWx1ZSA9PSAndHJ1ZScgfHwgdmFsdWUgPT0gJ2ZhbHNlJykgcGFyc2VkRW52W2tleV0gPSB2YWx1ZSA9PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcbiAgICBlbHNlIGlmICgvXlxcZCskLy50ZXN0KHZhbHVlKSkgcGFyc2VkRW52W2tleV0gPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgZWxzZSBpZiAodmFsdWUgPT0gJ251bGwnKSBwYXJzZWRFbnZba2V5XSA9IG51bGw7XHJcbiAgICBlbHNlIGlmICh2YWx1ZSA9PSAndW5kZWZpbmVkJykgcGFyc2VkRW52W2tleV0gPSB1bmRlZmluZWQ7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBhcnNlZEVudjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IHBhcnNlRW52KGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpKTtcclxuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb24gPSBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgfSksXHJcbiAgICBjaHVua1NwbGl0UGx1Z2luKHtcclxuICAgICAgc3RyYXRlZ3k6ICdkZWZhdWx0JyxcclxuICAgIH0pLFxyXG4gIF07XHJcblxyXG4gIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcclxuICAgIGlmIChlbnYuVklURV9QTFVHSU5fTEVHQUNZID09PSB0cnVlKSB7XHJcbiAgICAgIHBsdWdpbnMucHVzaChcclxuICAgICAgICBsZWdhY3koe1xyXG4gICAgICAgICAgdGFyZ2V0czogWyc+IDElJywgJ2xhc3QgMiB2ZXJzaW9ucycsICdub3QgZGVhZCcsICdub3QgSUUgMTEnXSxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKGVudi5WSVRFX1BMVUdJTl9DT01QUkVTUyA9PT0gdHJ1ZSkge1xyXG4gICAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgICAgY29tcHJlc3NQbHVnaW4oe1xyXG4gICAgICAgICAgdmVyYm9zZTogZmFsc2UsXHJcbiAgICAgICAgICBkaXNhYmxlOiBmYWxzZSxcclxuICAgICAgICAgIHRocmVzaG9sZDogMTAyNDAsXHJcbiAgICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgICAgIGV4dDogJy5neicsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogZW52LlZJVEVfU0VSVkVSX1BPUlQgYXMgbnVtYmVyLFxyXG4gICAgfSxcclxuICAgIHByZXZpZXc6IHtcclxuICAgICAgcG9ydDogZW52LlZJVEVfUFJFVklFV19QT1JUIGFzIG51bWJlcixcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBwbHVnaW5zLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAgIHN0cmVhbTogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3N0cmVhbScsXHJcbiAgICAgICAgZXZlbnRzOiAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvZXZlbnRzJyxcclxuICAgICAgICBxdWVyeXN0cmluZzogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3FzJyxcclxuICAgICAgICB1cmw6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy91cmwnLFxyXG4gICAgICAgIGh0dHBzOiAncm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvaHR0cCcsXHJcbiAgICAgICAgcGF0aDogJ3JvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3BhdGgnLFxyXG4gICAgICAgIHpsaWI6ICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy96bGliJyxcclxuICAgICAgICBhc3NlcnQ6ICdhc3NlcnQnLFxyXG4gICAgICAgIGNyeXB0bzogJ2NyeXB0by1icm93c2VyaWZ5JyxcclxuICAgICAgICB1dGlsOiAndXRpbCcsXHJcbiAgICAgICAgYnVmZmVyOiAnYnVmZmVyJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBiYXNlOiBlbnYuVklURV9QVUJMSUNfUEFUSCxcclxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxyXG4gICAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgc291cmNlbWFwOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyBmYWxzZSA6IHRydWUsXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMzAwMCxcclxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XHJcbiAgICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXHJcbiAgICAgICAgc3RyaWN0UmVxdWlyZXM6IFsvXFxAbWV0YXBsZXhcXC1mb3VuZGF0aW9uXFwvanMvXSxcclxuICAgICAgfSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIHBsdWdpbnM6IFtpbmplY3QoeyBCdWZmZXI6IFsnYnVmZmVyJywgJ0J1ZmZlciddIH0pLCBub2RlUG9seWZpbGxzKHsgY3J5cHRvOiB0cnVlIH0pXSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBnbG9iYWw6IHt9LFxyXG4gICAgICAncHJvY2Vzcy5lbnYnOiBPYmplY3QuYXNzaWduKHByb2Nlc3MuZW52ID8/IHt9LCBlbnYpLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3USxTQUFTLGNBQWMsZUFBNkI7QUFDNVQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxvQkFBb0I7QUFDM0IsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8sVUFBVTtBQVJqQixJQUFNLG1DQUFtQztBQVVsQyxTQUFTLFNBQVMsS0FBNkI7QUFDcEQsUUFBTSxZQUFxQyxFQUFFLEdBQUcsSUFBSTtBQUVwRCxTQUFPLFFBQVEsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNO0FBQzVDLFFBQUksU0FBUyxVQUFVLFNBQVM7QUFBUyxnQkFBVSxPQUFPLFNBQVMsU0FBUyxPQUFPO0FBQUEsYUFDMUUsUUFBUSxLQUFLLEtBQUs7QUFBRyxnQkFBVSxPQUFPLE9BQU8sS0FBSztBQUFBLGFBQ2xELFNBQVM7QUFBUSxnQkFBVSxPQUFPO0FBQUEsYUFDbEMsU0FBUztBQUFhLGdCQUFVLE9BQU87QUFBQSxFQUNsRCxDQUFDO0FBQ0QsU0FBTztBQUNUO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNqRCxRQUFNLE1BQU0sU0FBUyxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3JELFFBQU0sVUFBd0I7QUFBQSxJQUM1QixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLElBQ0QsaUJBQWlCO0FBQUEsTUFDZixVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQUksV0FBVyxTQUFTO0FBQ3RCLFFBQUksSUFBSSx1QkFBdUIsTUFBTTtBQUNuQyxjQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxTQUFTLENBQUMsUUFBUSxtQkFBbUIsWUFBWSxXQUFXO0FBQUEsUUFDOUQsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQ0EsUUFBSSxJQUFJLHlCQUF5QixNQUFNO0FBQ3JDLGNBQVE7QUFBQSxRQUNOLGVBQWU7QUFBQSxVQUNiLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxVQUNULFdBQVc7QUFBQSxVQUNYLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxRQUNQLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsSUFDQTtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLFFBQ2xDLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGFBQWE7QUFBQSxRQUNiLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsTUFBTSxJQUFJO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsTUFDUixRQUFRLFNBQVMsZUFBZSxPQUFPO0FBQUEsTUFDdkMsV0FBVyxTQUFTLGVBQWUsUUFBUTtBQUFBLE1BQzNDLHVCQUF1QjtBQUFBLE1BQ3ZCLGlCQUFpQjtBQUFBLFFBQ2YseUJBQXlCO0FBQUEsUUFDekIsZ0JBQWdCLENBQUMsNEJBQTRCO0FBQUEsTUFDL0M7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLFVBQVUsUUFBUSxFQUFFLENBQUMsR0FBRyxjQUFjLEVBQUUsUUFBUSxLQUFLLENBQUMsQ0FBQztBQUFBLE1BQ3JGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osZ0JBQWdCO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFFBQVEsQ0FBQztBQUFBLE1BQ1QsZUFBZSxPQUFPLE9BQU8sUUFBUSxPQUFPLENBQUMsR0FBRyxHQUFHO0FBQUEsSUFDckQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
