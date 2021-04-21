import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    access_token: '',
    role:''   // 1:admin
  },
  mutations: {
    setState(state,[key,value]){
      state[key] = value
    },
  },
  actions: {

  }
})
