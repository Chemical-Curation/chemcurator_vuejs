import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import rootGetters from "../getters.js";

const state = {
  loading: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "synonymTypes";
  }
};

// mutations
const mutations = {
  ...rootMutations
};

// getters
const getters = {
  ...rootGetters
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
