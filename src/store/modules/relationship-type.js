import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import rootGetters from "@/store/getters";

const state = {
  loading: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "relationshipTypes";
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
