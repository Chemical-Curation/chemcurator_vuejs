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
  fetchCompound: async (context, searchString) => {
    const endpoint =
      searchString.indexOf("-") > 0
        ? "/definedCompounds?filter[inchikey]="
        : "/compounds?filter[cid]=";
    await HTTP.get(endpoint + searchString)
      .then(response => {
        const data = response.data.data;
        if (data.length > 0) {
          const obj = data.shift();
          context.commit("setType", obj.type);
          context.commit("setCompound", obj.attributes);
        } else {
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          context.commit("setType", "definedCompound");
          context.dispatch("alert/alert", alert, { root: true });
        }
      })
      // this catch won't likely be used without any permissions set on GET
      .catch(() => context.dispatch("auth/logout", { root: true }));
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
