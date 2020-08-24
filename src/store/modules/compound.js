import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

import definedcompound from "./defined-compound";
import illdefinedcompound from "./illdefined-compound";

const defaultState = () => {
  return {
    count: 0,
    list: [],
    type: "definedCompound"
  };
};

const state = defaultState();
// actions
let actions = {
  ...rootActions,
  fetchCompound: async ({ commit, dispatch }, searchString) => {
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
          commit("clearState");
          commit("setType", obj.type);
          if (obj.type === "definedCompound") {
            commit("definedcompound/setAttributes", {
              attributes: obj.attributes,
              relationships: obj.relationships
            });
            if (data.included) {
              commit("definedcompound/setIncluded", data.included);
            }
          } else if (obj.type === "illDefinedCompound") {
            commit("illdefinedcompound/setAttributes", {
              attributes: obj.attributes,
              relationships: obj.relationships
            });
            console.log(data);
            if (data.included) {
              commit("illdefinedcompound/setIncluded", data.included);
            }
          }
          router.push({
            name: "substance"
          });
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
  }
};

// mutations
const mutations = {
  ...rootMutations,
  clearState(state) {
    Object.assign(state, defaultState());
  },
  setType(state, type) {
    state.type = type;
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
