import rootActions from "../actions.js";
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
    return "synonymQualities";
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
