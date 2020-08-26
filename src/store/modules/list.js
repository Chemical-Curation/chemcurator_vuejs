import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const state = {
  loaded: false,
  count: 0,
  list: []
};

const getResourceURI = () => { return "lists" }    // eslint-disable-line no-unused-vars

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => { return "lists" }
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
