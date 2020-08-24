import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import compound from "./modules/compound";
import alert from "./modules/alert";
import vocabularies from "./modules/vocabularies";
import substance from "./modules/substance";
import substanceType from "./modules/substance-type";
import source from "./modules/source";
import qcLevel from "./modules/qc-level";
import list from "./modules/list";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    compound,
    alert,
    vocabularies,
    substance,
    substanceType,
    source,
    qcLevel,
    list,
  }
});

store.subscribe((mutation, state) => {
  // Store user for cypress tests
  if (window.Cypress) {
    localStorage.setItem("user", state.user);
  }
});

export default store;
