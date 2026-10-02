import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/registrar',
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
  ],
})

export default router
