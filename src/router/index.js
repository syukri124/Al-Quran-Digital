import { createRouter, createWebHistory } from 'vue-router'
import JuzList from '../components/JuzList.vue'
import SurahList from '../components/SurahList.vue'
import JuzDetail from '../components/JuzDetail.vue'
import SurahDetail from '../components/SurahDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/juz'
  },
  {
    path: '/juz',
    name: 'JuzList',
    component: JuzList
  },
  {
    path: '/juz/:id',
    name: 'JuzDetail',
    component: JuzDetail,
    props: true
  },
  {
    path: '/surah',
    name: 'SurahList',
    component: SurahList
  },
  {
    path: '/surah/:id',
    name: 'SurahDetail',
    component: SurahDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 