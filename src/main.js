import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import GoButton from '@/components/button/button';
import GoIcon from '@/components/icon/icon';

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import '@/assets/styles/index.scss';

import GoUpload from '@/components/upload/upload';

Vue.config.productionTip = false

Vue.component(GoButton.name, GoButton);
Vue.component(GoIcon.name, GoIcon);
Vue.component(GoUpload.name, GoUpload);
Vue.use(ElementUI, {
  size: 'small'
});
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
