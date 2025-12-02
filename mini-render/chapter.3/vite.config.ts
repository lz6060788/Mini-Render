import { defineConfig } from "vite";
import path from "path";


export default defineConfig({
    root: 'demo',
    resolve: {
        alias: {
            '@': path.resolve('.', 'src'),
        },
    },
    server: {
        port: 3000,
    },
})