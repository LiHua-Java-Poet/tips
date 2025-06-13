import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const USER_KEY = 'user'

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem(USER_KEY)
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    userInfo: state => state.user
  }
})
