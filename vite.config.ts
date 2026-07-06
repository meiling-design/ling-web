import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      /* 对所有图片进行无损/近无损压缩 */
      png: { quality: 85 },
      jpg: { quality: 80, progressive: true },
      jpeg: { quality: 80, progressive: true },
      webp: { quality: 80, lossless: false },
      avif: { quality: 70, lossless: false },
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ["**/*.svg", "**/*.csv"],
});