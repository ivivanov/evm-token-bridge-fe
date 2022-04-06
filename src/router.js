import { createRouter, createWebHashHistory } from 'vue-router'

import Bridge from '@/pages/Bridge.vue'
import Import from '@/pages/Import.vue'
import Wrapper from '@/pages/Wrapper.vue'

const routes = [
  {
    path: '/bridge',
    component: Bridge,
    name: 'bridge'
  },
  {
    path: '/wrapper',
    component: Wrapper,
    name: 'wrapper'
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
