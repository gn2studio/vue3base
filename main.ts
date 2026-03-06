import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './src/App.vue'
import router from './src/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

document.title = import.meta.env.VUE_APP_SITE_TITLE ?? 'GN2Studio'

app.mount('#app')
