import { createApp } from 'vue'

import App from './App.vue'
import Router from './router.js'
import Store from './store.js'
import ValidatorService from './services/validator.js'

new ValidatorService().start()
const app = createApp(App)
app.use(Router)
app.use(Store)
app.mount('#app')
