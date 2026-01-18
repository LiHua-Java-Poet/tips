import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const USER_KEY = 'user'
const COLLAPSE_KEY = 'collapse'
const MENU_LIST = 'menu_list'


export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    isCollapse:localStorage.getItem(COLLAPSE_KEY) === 'true',
    menuList:JSON.parse(localStorage.getItem(MENU_LIST)) || null,
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
    setMenuList(state,menuList){
      state.menuList = menuList
      localStorage.setItem(MENU_LIST, JSON.stringify(menuList))
    }
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
    setMenu({ commit }, menuList) {
      commit('setMenuList', menuList)
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    userInfo: state => state.user,
    collapse: state => state.isCollapse,
    menuList: state => state.menuList,
  }
})
