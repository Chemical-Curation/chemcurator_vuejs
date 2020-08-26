import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import {HTTP} from "@/store/http-common";

const state = {
  count: 0,
  list: []
};

const actions = {
  ...rootActions,
  getList: async (context, resource) => {
    await HTTP.get("/" + resource).then(response => {
      context.commit("storeList", response.data.data);
      context.commit("storeCount", response.data.meta.pagination.count);
    });
  }
}

const mutations = {
  ...rootMutations
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
