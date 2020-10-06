import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { substanceFormFromRelationship } from "../getters";
import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    data: {},
    included: {}
  };
};

const state = defaultState();

// actions
const actions = {
  ...rootActions,
  getResourceURI: () => {
    return "definedCompounds";
  },
  fetchByMolfile: async ({ commit }, searchString) => {
    await HTTP.get(
      `/definedCompounds?include=substance&filter[molfileV2000]=${encodeURI(
        searchString
      )}`
    ).then(response => {
      const data = response.data;
      if (data.data.length > 0) {
        const obj = data.data.shift();

        commit(`storeFetch`, obj);
        commit(`storeIncluded`, data.included);
      } else {
        // for now, if a compound is found we want to leave it in state to do
        // a PATCH on it
        // commit("clearState");
      }
    });
  }
};

const getters = {
  getSubstanceForm: substanceFormFromRelationship
};

// mutations
const mutations = {
  ...rootMutations,
  clearState(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
