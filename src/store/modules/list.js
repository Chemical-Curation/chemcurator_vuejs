import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import rootGetters from "../getters.js";

import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    data: {},
    included: {},
    loaded: false,
    count: 0,
    list: []
  };
};

const state = defaultState();

let actions = {
  ...rootActions,
  async getObject(context, id) {
    await HTTP.get(`/lists/${id}?include=listAccessibility,types`).then(
      response => {
        context.commit("setAttributes", response.data);
        context.commit("storeIncluded", response.data.included);
      }
    );
  },
  getResourceURI: () => {
    return "lists";
  }
};

const getters = {
  ...rootGetters
};

const mutations = {
  ...rootMutations,
  clearState(state) {
    Object.assign(state, defaultState());
  },
  setAttributes(state, { data }) {
    state.data = data;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
