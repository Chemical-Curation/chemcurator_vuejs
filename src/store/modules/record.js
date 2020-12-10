import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import rootGetters from "../getters.js";

const defaultState = () => {
  return {
    data: {},
    included: {},
    loading: false,
    count: 0,
    list: []
  };
};

const state = defaultState();

let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "records";
  }
};

const getters = {
  ...rootGetters
};

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
