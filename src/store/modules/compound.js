import { HTTP } from "../http-common";
import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

import router from "@/router";

import definedcompound from "./defined-compound";
import illdefinedcompound from "./illdefined-compound";

const defaultState = () => {
  return {
    count: 0,
    list: []
  };
};

const state = defaultState();
// actions
let actions = {
  ...rootActions,
  getResourceURI: () => { return "compounds" },
  fetchCompound: async ({ commit, dispatch }, {searchString, push}) => {
    // Search drops you on the Substance page.
    if (push && router.currentRoute.name !== "substance")
      await router.push("substance")
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

          let targetModule = obj.type.toLowerCase();
          commit(`${targetModule}/storeFetch`, {
            attributes: obj.attributes,
            relationships: obj.relationships
          });
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

// Exports for child modules
export function substanceForm(state) {
  if (
    !(
      state.relationships &&
      state.relationships.substance &&
      state.relationships.substance.data &&
      state.relationships.substance.data.length !== 0
    )
  ) {
    return {
      sid: "",
      preferredName: "",
      casrn: "",
      substanceDescription: "",
      privateQCNotes: "",
      publicQCNotes: "",
      qcLevelID: "",
      sourceID: "",
      substanceTypeID: ""
    };
  }
  // todo: if this is 1 to 1 we need to clarify that.
  let type = state.relationships.substance.data[0].type;
  let id = state.relationships.substance.data[0].id;

  let attributes = state.included[type][id].attributes;
  let relationships = state.included[type][id].relationships;
  return {
    sid: attributes.sid,
    preferredName: attributes.preferredName,
    casrn: attributes.casrn,
    substanceDescription: attributes.description,
    privateQCNotes: attributes.privateQcNote,
    publicQCNotes: attributes.publicQcNote,
    qcLevelID: relationships.qcLevel.data.id,
    sourceID: relationships.source.data.id,
    substanceTypeID: relationships.substanceType.data.id
  };
}
