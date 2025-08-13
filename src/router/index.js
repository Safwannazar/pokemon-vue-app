import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailView from '../views/PokemonDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home - PokéApp'
    }
  },
  {
    path: '/pokemon/:id',
    name: 'PokemonDetail',
    component: PokemonDetailView,
    meta: {
      title: 'Pokémon Details - PokéApp'
    }
  },
  {
    // Catch all route for 404
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'PokéApp'
  next()
})

export default router