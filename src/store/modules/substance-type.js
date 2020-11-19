import rootActions from "../actions.js";
import rootGetters from "../getters.js";
import rootMutations from "../mutations.js";

const state = {
  loading: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substanceTypes";
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
