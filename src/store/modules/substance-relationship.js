import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const state = {
  loading: false,
  count: 0,
  list: [],
  included: {}
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substanceRelationships";
  }
};

// mutations
const mutations = {
  ...rootMutations
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
