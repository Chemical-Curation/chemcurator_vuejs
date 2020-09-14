import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { substanceFormFromRelationship } from "../getters";
import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    attributes: {},
    relationships: {},
    included: {}
  };
};

const state = defaultState();

// actions
const actions = {
  ...rootActions,
  resourceURI: () => {
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

        commit(`storeFetch`, {
          attributes: obj.attributes,
          relationships: obj.relationships
        });
        commit(`storeIncluded`, data.included);
      } else {
        commit("clearState");
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
