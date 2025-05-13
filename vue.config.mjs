import { defineConfig } from "@vue/cli-service";
import { initAutoImport, initComponents, initIcons } from "./builder/webpackPlugins.mjs";
import { toFilePath } from "./builder/utils.mjs";

export default defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./",
  configureWebpack: {
    plugins: [initAutoImport(), initComponents(), initIcons()],
    resolve: {
      alias: {
        "@": toFilePath("./src")
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@use "@/assets/css/variable.scss" as *;'
      }
    }
  }
});
