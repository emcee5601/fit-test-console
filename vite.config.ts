import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            src: "/src",
            local_projects: "/.."
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "es2023"
        }
    },
    build: {
        target: "es2023"
    },
    plugins: [
        react(),
        VitePWA({
            // cache all imports
            workbox: {
                globPatterns: ["**/*"],
                maximumFileSizeToCacheInBytes: 3000000, // default is 2mb
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
                "start_url": "./",
                "display": "standalone",
                theme_color: "lightgray"
            }
        }),
    ],
    base: "./",
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    }
})
