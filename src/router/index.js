import { createRouter, createWebHistory } from 'vue-router';
import DMScreen from '../components/DMScreen.vue';
import PlayerView from '../components/PlayerView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DMScreen,
  },
  {
    path: '/dm-screen/player-view',
    name: 'DMScreenPlayerView',
    component: PlayerView,
  },
  {
    path: '/dm-screen',
    name: 'DMScreen',
    component: DMScreen,
  },

  {
    path: '/player-view',
    name: 'PlayerView',
    component: PlayerView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
