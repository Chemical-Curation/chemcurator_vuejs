import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const defaultState = () => {
  return {
    data: {
      id: "",
      attributes: {
        mrvfile: "<MDocument/>"
      }
    },
    included: {},
    changed: false
  };
};

const state = defaultState();

// actions
const actions = {
  ...rootActions,
  getResourceURI: () => {
    return "illDefinedCompounds";
  }
};

const getters = {};

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
