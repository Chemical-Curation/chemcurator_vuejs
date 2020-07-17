import { HTTP } from "../http-common";

const state = {
  cid: "",
  inchikey: "",
  mrvfile: "",
  molfile: "",
  type: "definedCompound"
};
// actions
const actions = {
  fetchCompound: async ({ commit, dispatch }, searchString) => {
    dispatch("auth/fetchUser", null, { root: true });
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
        } else {
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          commit("setType", "definedCompound");
          dispatch("alert/alert", alert, { root: true });
        }
      })
      // this catch won't likely be used without any permissions set on GET
      .catch(() => dispatch("auth/logout", { root: true }));
  }
};

// mutations
const mutations = {
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
