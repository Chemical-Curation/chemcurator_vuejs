import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import compound from "./modules/compound";
import alert from "./modules/alert";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    compound,
    alert
  }
});

store.subscribe((mutation, state) => {
  // Store user for cypress tests
  if (window.Cypress) {
    localStorage.setItem("user", state.user);
  }
});

export default store;
