import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/repo',
      name: 'repo',
      component: () => import('../views/RepoView.vue')
    },
    {
      path: '/types',
      name: 'types',
      component: () => import('../views/TypeBrowserView.vue')
    },
    {
      path: '/sheet',
      name: 'sheet',
      component: () => import('../views/SheetView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
