import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

import definedcompound from "./defined-compound";
import illdefinedcompound from "./illdefined-compound";

const defaultState = () => {
  return {
    count: 0,
    type: "none",
    list: []
  };
};

const state = defaultState();
// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "compounds";
  },
  fetchCompound: async ({ commit, dispatch }, { searchString, push }) => {
    // Search drops you on the Substance page.
    if (push && router.currentRoute.name !== "substance")
      await router.push("substance");
    dispatch("clearAllStates");

    dispatch("auth/fetchUser", null, { root: true });
    const endpoint =
      searchString.indexOf("-") > 0
        ? "/definedCompounds?include=substance&filter[inchikey]="
        : "/compounds?include=substance&filter[cid]=";
    await HTTP.get(endpoint + searchString)
      .then(response => {
        const data = response.data;
        if (data.data.length > 0) {
          const obj = data.data.shift();

          if (obj.type === "definedCompound") commit("setType", obj.type);
          else commit("setType", obj.relationships.queryStructureType.data.id);

          let targetModule = obj.type.toLowerCase();
          commit(`${targetModule}/storeFetch`, obj);
          commit(`${targetModule}/storeIncluded`, data.included);
        } else {
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          commit("clearState");
          dispatch("alert/alert", alert, {
            root: true
          });
        }
      })
      // this catch won't likely be used without any permissions set on GET
      .catch(() =>
        dispatch("auth/logout", {
          root: true
        })
      );
  },
  clearAllStates: async ({ commit }) => {
    commit("clearState");
    commit("definedcompound/clearState");
    commit("illdefinedcompound/clearState");
  }
};

// mutations
const mutations = {
  ...rootMutations,
  setType(state, type) {
    state.type = type;
  },
  clearState(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    definedcompound,
    illdefinedcompound
  }
};
