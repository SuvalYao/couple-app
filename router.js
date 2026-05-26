import { createRouter, createWebHashHistory } from 'vue-router'
import GameWheel from './views/GameWheel.vue'

const routes = [
  { path: '/', component: GameWheel }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router