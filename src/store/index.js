import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: ""
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.user = "";
    },
    CYPRESS_SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    logout({ commit }) {
      commit("LOGOUT");
    }
  },
  getters: {
    isLoggedIn: state => !!state.user
  },
  modules: {}
});

store.subscribe((mutation, state) => {
  // Store user for cypress tests
  if (window.Cypress) {
    localStorage.setItem("user", state.user);
  }
});

export default store;
