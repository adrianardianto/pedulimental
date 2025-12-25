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
      component: HomeView,
      meta: { title: 'Beranda' }
    },
    {
      path: '/edukasi',
      name: 'edukasi',
      component: () => import('../views/EdukasiView.vue'),
      meta: { requiresAuth: true, title: 'Edukasi' }
    },
    {
      path: '/konsultasi',
      name: 'konsultasi',
      component: () => import('../views/KonsultasiView.vue'),
      meta: { requiresAuth: true, title: 'Konsultasi' }
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/TrackerView.vue'),
      meta: { requiresAuth: true, title: 'Tracker Kesehatan' }
    },
    {
      path: '/komunitas',
      name: 'komunitas',
      component: () => import('../views/KomunitasView.vue'),
      meta: { requiresAuth: true, title: 'Komunitas' }
    },
    {
      path: '/riwayat',
      name: 'riwayat',
      component: () => import('../views/RiwayatView.vue'),
      meta: { requiresAuth: true, title: 'Riwayat Aktivitas' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true, title: 'Profil Saya' }
    },
    {
      path: '/edukasi/:id',
      name: 'detail-artikel',
      component: () => import('../views/DetailArtikelView.vue'),
      meta: { requiresAuth: true, title: 'Detail Artikel' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Masuk' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Update Title
  document.title = to.meta.title ? `${to.meta.title} | PeduliMental` : 'PeduliMental';

  const isLoggedIn = localStorage.getItem('user') || sessionStorage.getItem('user');
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
