import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const USER_KEY = 'user'
const COLLAPSE_KEY = 'collapse'


export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    isCollapse:localStorage.getItem(COLLAPSE_KEY) === 'true'
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem(USER_KEY)
    },
    setCollapse(state, collapse) {
      state.isCollapse = collapse
      localStorage.setItem(COLLAPSE_KEY, collapse)
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('clearUser')
    },
    setCollapse({ commit }, collapse) {
      commit('setCollapse', collapse)
    },
  },
  getters: {
    isLoggedIn: state => !!state.user,
    userInfo: state => state.user,
    collapse: state => state.isCollapse,
  }
})
