import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { substanceFormFromRelationship } from "../getters";

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
