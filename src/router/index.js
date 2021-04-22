import Vue from 'vue';
import Router from 'vue-router';
import Audit from '@/components/Audit'
import VideoList from '@/components/VideoList'
import videoPlay from '@/components/VideoPlay'
import BadGateway from '@/components/BadGateway'
import Login from "@/components/Login"

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      props: { page: 1 },
      component: Login
    },
    {
      path: '/audit',
      name: 'Audit',
      component: Audit,
      props: { page: 2 },
      alias: '/'
    },
    {
      path: '/videoList',
      name: 'VideoList',
      props: { page: 3 },
      component: VideoList
    },
    {
      path: '/videoPlay',
      name: 'VideoPlay',
      props: { page: 4 },
      component: videoPlay
    },
    {
      path: '/404',
      name: 'BadGateway',
      props: { page: 5 },
      component: BadGateway
    },
    {
      path: '*',
      props: { page: 5 },
      redirect: '/404'
    },

  ]
})