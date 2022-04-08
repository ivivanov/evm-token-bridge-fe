import { createRouter, createWebHashHistory } from 'vue-router'

import Bridge from '@/pages/Bridge.vue'
import Import from '@/pages/Import.vue'
import Wrapped from '@/pages/Wrapped.vue'

const routes = [
  {
    path: '/bridge',
    component: Bridge,
    name: 'bridge'
  },
  {
    path: '/wrapped',
    component: Wrapped,
    name: 'wrapped'
  },
  {
    path: '/import',
    component: Import,
    name: 'import'
  }
]

const Router = createRouter({
  // If using gh pages for static serving
  // there is an issue with the routing.
  // quick fix: hash mode - https://stackoverflow.com/a/65502608
  history: createWebHashHistory(),
  routes: routes,
  linkExactActiveClass: 'on',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default Router
