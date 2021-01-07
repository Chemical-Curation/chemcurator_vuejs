import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

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

// getters
const getters = {
  getCompound: state => {
    if (state.type === "definedCompound") {
      return definedcompound.state.data;
    } else if (state.type === "none") {
      return null;
    } else {
      return illdefinedcompound.state.data;
    }
  }
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "compounds";
  },
  fetchCompound: async ({ commit }, { id }) => {
    //dispatch("clearAllStates");

    let endpoint = `/compounds/${id}`;
    await HTTP.get(endpoint).then(response => {
      const obj = response.data.data;
      if (obj.type === "definedCompound") {
        commit("setType", obj.type);
        commit("definedcompound/storeFetch", obj);
      } else {
        commit("setType", obj.relationships.queryStructureType.data.id);
        commit("illdefinedcompound/storeFetch", obj);
      }
    });
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
  getters,
  mutations,
  modules: {
    definedcompound,
    illdefinedcompound
  }
};
