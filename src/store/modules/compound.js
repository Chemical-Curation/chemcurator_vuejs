import { HTTP } from "../http-common";

const defaultState = () => {
  return {
    type: "definedCompound",
    definedCompound: {
      cid: "",
      inchikey: "",
      molfile: ""
    },
    illDefinedCompound: {
      cid: "",
      mrvfile: "",
      molfile: ""
    }
  };
};

const state = defaultState();
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
          commit("clearState");
          commit("setType", obj.type);
          commit("setCompound", { ...obj.attributes, type: obj.type });
        } else {
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          commit("clearState");
          dispatch("alert/alert", alert, { root: true });
        }
      })
      // this catch won't likely be used without any permissions set on GET
      .catch(() => dispatch("auth/logout", { root: true }));
  }
};

// mutations
const mutations = {
  clearState(state) {
    Object.assign(state, defaultState());
  },
  setCompound(state, obj) {
    const { cid, inchikey, mrvfile, molfileV3000, type } = obj;
    if (type === "illDefinedCompound") {
      state.illDefinedCompound.cid = cid;
      state.illDefinedCompound.mrvfile = mrvfile;
      state.illDefinedCompound.molfile = molfileV3000;
    }
    if (type === "definedCompound") {
      state.definedCompound.cid = cid;
      state.definedCompound.inchikey = inchikey;
      state.definedCompound.molfile = molfileV3000;
    }
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
