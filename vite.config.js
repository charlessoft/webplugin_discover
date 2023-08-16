import {defineConfig,loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// const env = loadEnv(mode, process.cwd(), '')
// https://vitejs.dev/config/


export default ({ mode }) => {
    const env=loadEnv(mode, process.cwd());   // 获取.env文件里定义的环境变量
    console.log(`${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}`)
    console.log(`${env.VITE_SERVER_PORT}`)

    return  defineConfig({

        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'), // 路径别名
            },
            extensions: ['.js', '.ts', '.json'] // 导入时想要省略的扩展名列表
        },
        server: {
            host: '0.0.0.0',
            port: env.VITE_CLI_PORT,
            // 是否开启 https
            https: false,
            proxy: {
                // 把key的路径代理到target位置
                // detail: https://cli.vuejs.org/config/#devserver-proxy
                // '/api/':{
                //     target: 'http://localhost:2223/',
                //     changeOrigin:true,
                // }
                [env.VITE_BASE_API]: { // 需要代理的路径   例如 '/api'
                // "^/api": {
                    // target: `http://localhost:2223/`,
                    target: `${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}`, // 代理到 目标路径
                    changeOrigin: true,
                    rewrite: path => {
                        console.log('xxxxxxxxxxxxxxxxxxxxxx' + env.VITE_BASE_API)
                        return path.replace(new RegExp('^' + env.VITE_BASE_API), '')
                    },
                }
            },
        },
        // 此处开启 https
        // https: true,
        plugins: [
            vue(),


        ],

    })

}

