import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard'
import Profile from '@/components/Profile'
import VideoList from '@/components/VideoList'
import videoPlay from '@/components/VideoPlay'
import BadGateway from '@/components/BadGateway'
import Login from "@/components/Login";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/dashboard',
      name: '审计',
      component: Dashboard,
      props: { page: 1 },
      alias: '/'
    },
    {
      path: '/profile',
      name: 'Profile',
      props: { page: 2 },
      component: Profile
    },
    {
      path: '/videoList',
      name: 'VideoList',
      props: { page: 3 },
      component: VideoList
    },
    {
      path: '/videoPlay',
      name: '视频预览',
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
    {
      path: '/login',
      name: 'Login',
      props: { page: 6 },
      component: Login
    }
  ]
})