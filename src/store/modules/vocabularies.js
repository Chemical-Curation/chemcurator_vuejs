import {HTTP} from "../http-common";

const state = {
  list: []
};

const mutations = {
  storeList(state, payload) {
    state.list = payload
  }
}

// actions
const actions = {
  getList: async (context, resource) => {
    context.dispatch("auth/fetchUser", null, { root: true });
    await HTTP.get("/" + resource)
      .then(response => {
        context.commit("storeList", response.data.data);
      })
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
