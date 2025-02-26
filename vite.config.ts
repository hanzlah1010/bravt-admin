import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import fonts from "unplugin-fonts/vite"

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    fonts({
      fontsource: {
        families: [
          {
            name: "Work Sans",
            weights: [400, 500, 600, 700],
            styles: ["normal"],
            subset: "latin"
          },
          {
            name: "EB Garamond",
            weights: [500],
            styles: ["normal"],
            subset: "latin"
          }
        ]
      }
    })
  ]
})
