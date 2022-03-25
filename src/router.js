import { createRouter, createWebHashHistory } from 'vue-router'

import Bridge from '@/pages/Bridge.vue'
import Claim from '@/pages/Claim.vue'
import Faucet from '@/pages/Faucet.vue'

const routes = [
  {
    path: '/bridge',
    component: Bridge,
    name: 'bridge'
  },
  {
    path: '/claim',
    component: Claim,
    name: 'claim'
  },
  {
    path: '/faucet',
    component: Faucet,
    name: 'faucet'
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
