import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/edukasi',
      name: 'edukasi',
      component: () => import('../views/EdukasiView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/konsultasi',
      name: 'konsultasi',
      component: () => import('../views/KonsultasiView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/TrackerView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/komunitas',
      name: 'komunitas',
      component: () => import('../views/KomunitasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/riwayat',
      name: 'riwayat',
      component: () => import('../views/RiwayatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/edukasi/:id',
      name: 'detail-artikel',
      component: () => import('../views/DetailArtikelView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user') || sessionStorage.getItem('user');
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
