import Vue from 'vue';
import Router from 'vue-router';
//import VueRouter from 'vue-router';

Vue.use(Router);
//const originalPush = VueRouter.prototype.push
//   VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
//}
export default new Router({
    routes: [
        {
            path: '/Mapper',
            component: () => import('../components/Mapper.vue'),
        },
        {
            path: '/upfile',
            component: () => import('../components/Upfile.vue'),
        },
        {
            path: '/login',
            component: () => import('../components/Login.vue'),
        },
        {
            path: '/icon',
            component: () => import('../components/Icon.vue'),
        }
    ]
});
