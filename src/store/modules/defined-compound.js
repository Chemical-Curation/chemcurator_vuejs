import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { substanceFormFromRelationship } from "../getters";
import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    data: {},
    included: {},
    blank: "  0  0  0     0  0            999 V2000\nM  END"
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
        console.log("doin nuthin in fetchByMolfile");
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
