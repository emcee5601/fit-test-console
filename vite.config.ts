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
        target: "es2023",
        rollupOptions: {
            output: {
                manualChunks: {
                    'ajv': ["ajv"],
                    'drivers': ["ftdi-js", "pl2303", "ch34x-webusb-serial-ts"],
                    'echarts': ["echarts", "echarts-for-react"],
                    'function-plot': ["function-plot"],
                    'mui': ["@mui/system", "@mui/base"],
                    'qr-code': ["@yudiel/react-qr-scanner", "qrcode.react"],
                    'react-datepicker': ["react-datepicker"],
                    'react-etc': ["react-dom", "react-icons", "react-intersection-observer", "react-router", "react-select"],
                    'tanstack-tables': ["@tanstack/react-table", "@tanstack/react-virtual"],
                    'utils': ["export-to-csv", "json-2-csv", "json-stringify-deterministic", "lz-string", "moving-average"]
                }
            }
        }
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
