import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const state = {
  loaded: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => { return "sources" }
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
