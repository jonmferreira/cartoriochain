import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/HomeView.vue'),
    },
    {
      path: '/registrar',
      name: 'registrar',
      component: () => import('../views/registrar/RegistrarView.vue'),
    },
    {
      path: '/verificar',
      name: 'verificar',
      component: () => import('../views/verificar/VerificarView.vue'),
    },
    {
      path: '/verificar/:docId',
      name: 'verificar-doc',
      component: () => import('../views/verificar/VerificarView.vue'),
    },
    {
      path: '/servicos',
      name: 'servicos',
      component: () => import('../views/servicos/ServicosView.vue'),
    },
  ],
})

export default router
