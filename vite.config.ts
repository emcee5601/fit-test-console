import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePWA({
          // cache all imports
          workbox: {
              globPatterns: ["**/*"],
          },
          // cache all assets public
          includeAssets: [
              "**/*",
          ],
          manifest: {
              "name": "mark's fit test console",
              "icons": [
                  {
                      "src": "icons/mftc-icon-192.png",
                      "type": "image/png",
                      "sizes": "192x192"
                  }
              ],
              "start_url": "/fit-test-console",
              "display": "standalone",
              theme_color: "#dddddd"
          }
      }),
  ],
  base: "/fit-test-console",
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
