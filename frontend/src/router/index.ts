import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/library'
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: '/tracks/:id',
      name: 'track-detail',
      component: () => import('../views/TrackDetailView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue')
    },
    {
      path: '/checkout/success',
      name: 'checkout-success',
      component: () => import('../views/CheckoutSuccessView.vue')
    },
    {
      path: '/admin/tracks',
      name: 'admin-tracks',
      component: () => import('../views/AdminTracksView.vue'),
      meta: { adminOnly: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isPublic = to.name === 'login';
  if (!isPublic && !authStore.isAuthenticated) return { name: 'login' };
  if (to.meta.adminOnly && !authStore.isAdmin) return { name: 'library' };
  if (isPublic && authStore.isAuthenticated) return { name: 'library' };
  return true;
});

export default router
