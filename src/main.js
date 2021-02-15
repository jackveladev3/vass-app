import Vue from 'vue'
import VModal from 'vue-js-modal'
import VCalendar from 'v-calendar' // Vue Calendar 2.0\
import vuetify from '@/plugins/vuetify'
import router from './router'
import App from './App.vue'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from '@/utils/aws-exports'
import AWS from 'aws-sdk'

import store from './store/store' // path to vuetify export

import 'vue-search-select/dist/VueSearchSelect.css'
import '@/assets/styles/index.scss';

Amplify.configure(awsconfig)
Vue.use(AmplifyPlugin, AmplifyModules)

AWS.config.region = awsconfig.aws_cognito_region

Vue.config.productionTip = false

Vue.use(VModal)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')

Vue.use(VCalendar, {
  componentPrefix: 'vc',
  inPrevMonth: true,
  locales: {
    'ja-JA': {
      firstDayOfWeek: 2,
      masks: {
        L: 'YYYY-MM-DD'
      }
    }
  }
})

