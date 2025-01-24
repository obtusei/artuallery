import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [commonjs()],
  resolve: {
    alias: {
      stream: "stream-browserify",
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: "es",
      },
    },
    commonjsOptions: {
      include: ["node_modules/**"],
    },
  },
  base: "./",
});
