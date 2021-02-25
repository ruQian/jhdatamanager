import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import GoButton from '@/components/button/button';
import GoIcon from '@/components/icon/icon';

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import '@/assets/styles/index.scss';

import GoUpload from '@/components/upload/upload';
import './assets/css/icon.css';

Vue.config.productionTip = false

Vue.component(GoButton.name, GoButton);
Vue.component(GoIcon.name, GoIcon);
Vue.component(GoUpload.name, GoUpload);
Vue.use(ElementUI, {
  size: 'big'
});


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //document.title = `${to.meta.title} | vue-manage-system`;
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isChrom = userAgent.indexOf("Chrome") > -1;
    if(isChrom)
    {
        console.log(to.path);
        if (to.path == '/')
        {
            next('/login');
        }else{
              next();
        }
    }else{
        Vue.prototype.$alert('清使用chrom浏览器或360浏览器', {
            confirmButtonText: '确定'
        });
    }
  /*
  const role = localStorage.getItem('ms_username');
  if (!role && to.path !== '/login') {
      next('/login');
  } else if (to.meta.permission) {
      // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
      role === 'admin' ? next() : next('/403');
  } else {
      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
          Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
              confirmButtonText: '确定'
          });
      } else {
          next();
      }
  }*/
});




new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
