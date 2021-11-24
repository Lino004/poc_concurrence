import Vue from 'vue'
import Buefy from 'buefy'
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue'
import router from './router'
import { CLE_GOOGLE_API } from './configuration/configurationCarte';
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueGoogleMaps, {
  load: {
    key: CLE_GOOGLE_API,
    libraries: 'places,drawing,visualization',
    region: 'FR',
    language: 'fr',
  },
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
