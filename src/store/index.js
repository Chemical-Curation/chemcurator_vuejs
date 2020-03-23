import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: ""
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.user = "";
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
