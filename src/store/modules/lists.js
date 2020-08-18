import { HTTP } from "../http-common";

const state = {
  list: []
};

const mutations = {
  storeList(state, payload) {
    state.list = payload;
  }
};

// actions
const actions = {
  getList: async context => {
    await HTTP.get("/lists").then(response => {
      context.commit("storeList", response.data.data);
    });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
