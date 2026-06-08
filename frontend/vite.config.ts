import { defineConfig } from "vite";
import * as path from "path";

const entryPoints = [
  "main",
  "article",
  "blog",
  "contacts",
  "services",
  "offer",
  "promos",
  "reviews",
  "privacy",
  "error",
];

const input = Object.fromEntries(
  entryPoints.map((entry) => [entry, path.resolve(__dirname, `src/${entry}.ts`)]),
);

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, "../backend/public"),
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/[name].min[extname]";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
});
