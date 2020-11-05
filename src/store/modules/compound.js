import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

import definedcompound from "./defined-compound";
import illdefinedcompound from "./illdefined-compound";

const defaultState = () => {
  return {
    loading: false,
    count: 0,
    type: "none",
    list: []
  };
};

const state = defaultState();
// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "compounds";
  },
  fetchCompound: async ({ commit, dispatch }, { id, push }) => {
    // Search drops you on the Substance page.
    if (push && router.currentRoute.name !== "substance")
      await router.push("substance");
    dispatch("clearAllStates");

    let endpoint = `/compounds/${id}`
    await HTTP.get(endpoint)
      .then(response => {
        const obj = response.data.data;
        if (obj.type === "definedCompound") {
          commit("setType", obj.type);
          commit("definedcompound/storeFetch", obj);
          // commit(`definedcompound/storeIncluded`, response.data.included);
        } else {
          commit("setType", obj.relationships.queryStructureType.data.id);
          commit("illdefinedcompound/storeFetch", obj);
          // commit("illdefinedcompound/storeIncluded", response.data.included);
        }
      })
  },
  clearAllStates: async ({ commit }) => {
    commit("clearState");
    commit("definedcompound/clearState");
    commit("illdefinedcompound/clearState");
  }
};

// mutations
const mutations = {
  ...rootMutations,
  setType(state, type) {
    state.type = type;
  },
  clearState(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    definedcompound,
    illdefinedcompound
  }
};
