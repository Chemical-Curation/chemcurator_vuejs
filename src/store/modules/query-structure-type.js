import rootActions from "../actions.js";
import rootGetters from "../getters.js";
import rootMutations from "../mutations.js";

const state = {
  loaded: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "queryStructureTypes";
  }
};

// getters
let getters = {
  ...rootGetters
};

// mutations
const mutations = {
  ...rootMutations
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
