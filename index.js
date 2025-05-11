import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Recommend from '../components/Recommend.vue';
import TravelLog from '../components/TravelLog.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/travel-log',
    name: 'TravelLog',
    component: TravelLog
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;    