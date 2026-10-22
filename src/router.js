import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectView from './views/ProjectView.vue';
import PrivacyView from './views/PrivacyView.vue';
import NotFoundView from './views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects/:id', name: 'project', component: ProjectView, props: true },
    { path: '/projects/:id/privacy', name: 'privacy', component: PrivacyView, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior: (to, from, saved) => saved ?? { top: 0 },
});

export default router;
