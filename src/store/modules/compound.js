import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

import substance from "./substance";
import definedcompound from "./defined-compound";
import illdefinedcompound from "./illdefined-compound";

const defaultState = () => {
  return {
    loading: false,
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
          const obj = data.data[0];
          if (obj.type === "definedCompound") {
            commit("setType", obj.type);
            commit(`definedcompound/storeIncluded`, data.included);
            // TODO: The following action is because of the difference in what is returned
            //       by the list and detail serializers.  If the compound is a defined compound
            //       in order to load the additional data this response has to be thrown out
            //       and the GET needs to be repeated.  There may be ways around this with resolution
            //       or if the json:api id is the same as the cid being passed in.
            dispatch("definedcompound/getFetch", obj.id);
          } else {
            commit("setType", obj.relationships.queryStructureType.data.id);
            commit("illdefinedcompound/storeFetch", obj);
            commit("illdefinedcompound/storeIncluded", data.included);
          }
          if (data?.included) {
            const substance = data.included[0];
            dispatch("substance/loadForm", substance, { root: true });
          } else {
            commit("substance/clearForm");
          }
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
    substance,
    definedcompound,
    illdefinedcompound
  }
};
