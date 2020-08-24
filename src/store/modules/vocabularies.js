import actions from "../actions.js";
import mutations from "../mutations.js";

const state = {
  count: 0,
  list: []
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
