import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
    plugins: [
        vue(),
        basicSsl(), // HTTPS 자체서명 인증서 (개발 환경용)
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3001,
        hmr: {
            // HTTPS 환경에서 HMR WebSocket이 wss:// 프로토콜을 사용하도록 명시
            protocol: 'wss',
            host: 'localhost',
            port: 3001,
        },
    },
})



