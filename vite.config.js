import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [commonjs()],
  resolve: {
    alias: {
      stream: "stream-browserify",
    },
  },
  optimizeDeps: {
    include: ["gsap"],
  },
  build: {
    commonjsOptions: {
      include: ["node_modules/**"],
    },
  },
});
