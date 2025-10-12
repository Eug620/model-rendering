import { createApp } from 'vue'
import  './styles/base.css'
// 引入进度条样式
import 'nprogress/nprogress.css'
import  './styles/nprogress.scss'

import App from './App.vue'
import { useInitRouter } from './router'
import { pinia } from './store'


const app = createApp(App)
const router = useInitRouter(app)
app.use(pinia)
app.use(router)
app.mount('#app')
