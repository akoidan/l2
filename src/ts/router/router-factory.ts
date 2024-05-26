import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router';
import { ROUTER_BASE_URL } from '@/ts/utils/consts';
import MainPage from '@/vue/pages/main-page.vue';
import { pagesPath } from '@/ts/router/pages-path';


export function routerFactory(): Router {
  const routes: RouteRecordRaw[] = [
    {
      path: pagesPath.main.home,
      component: MainPage,
    }
  ];
  const history: RouterHistory = ROUTER_BASE_URL ? createWebHashHistory(ROUTER_BASE_URL) : createWebHistory();

  return createRouter({
    history,
    routes,
  });
}
