import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

app.mount('#app')
