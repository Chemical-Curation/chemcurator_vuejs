import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

const state = {
  count: 0,
  list: [],
  cid: "",
  inchikey: "",
  mrvfile: "",
  molfile: "",
  type: "definedCompound"
};
// actions
let actions = {
  ...rootActions,
  fetchCompound: async ({ commit, dispatch }, searchString) => {
    dispatch("auth/fetchUser", null, {
      root: true
    });
    const endpoint =
      searchString.indexOf("-") > 0
        ? "/definedCompounds?filter[inchikey]="
        : "/compounds?filter[cid]=";
    await HTTP.get(endpoint + searchString)
      .then(response => {
        const data = response.data.data;
        if (data.length > 0) {
          const obj = data.shift();
          commit("setType", obj.type);
          commit("setCompound", obj.attributes);
          router.push({
            name: "substance"
          });
        } else {
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          commit("setType", "definedCompound");
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
  setCompound(state, obj) {
    const { cid, inchikey, mrvfile, molfileV3000 } = obj;
    state.cid = cid;
    state.inchikey = inchikey;
    state.mrvfile = mrvfile;
    state.molfile = molfileV3000;
  },
  setType(state, type) {
    state.type = type;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
