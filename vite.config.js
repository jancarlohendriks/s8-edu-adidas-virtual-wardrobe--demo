import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { resolve } from "pathe";

export default defineConfig({
  base: "./",
  root: "src",
  build: {
    outDir: "../dist",
    publicDir: "assets",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [glsl()],
});
