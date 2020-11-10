import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { HTTP } from "@/store/http-common";
import router from "@/router";

const defaultState = () => {
  return {
    included: {},
    loading: false,
    count: 0,
    list: [],
    form: {}
  };
};

const state = defaultState();

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substances";
  },
  substanceSearch: async (context, { searchString, push }) => {
    let resource = await context.dispatch("getResourceURI");

    if (push && router.currentRoute.name !== "substance")
      await router.push("substance");

    await HTTP.get(`/${resource}?filter[search]=${encodeURI(searchString)}`)
      .then(response => {
        context.commit("storeList", response.data.data);
        context.commit("storeCount", response.data.meta.pagination.count);

        if (response.data.data.length > 0) {
          let loaded_substance = response.data.data[0];
          let compound_id =
            loaded_substance.relationships.associatedCompound.data.id;

          context.dispatch("loadForm", loaded_substance);
          context.dispatch(
            `compound/fetchCompound`,
            { id: compound_id },
            { root: true }
          );
        } else {
          // Handle no rows returned
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          context.commit("clearState");
          context.dispatch(`compound/clearAllStates`, {}, { root: true });
          context.dispatch("alert/alert", alert, {
            root: true
          });
        }
      })
      .catch(err => {
        const alert = {
          message: err.response.data.errors.shift()?.detail,
          color: "danger",
          dismissCountDown: 4
        };
        context.dispatch("alert/alert", alert, {
          root: true
        });
      });
  },
  loadForm({ commit }, payload) {
    // filtering here to accomodate the SubstanceSidebar component and
    // the fetchByMolfile action on compound, if fetched we want to use
    // includes and return the obj, but if clicked from the tree we need
    // to use the ID, the object may not exist in the state.list when
    // using fetchByMolfile once the list of substances get big enough
    if (typeof payload === "string") {
      payload = state.list.filter(sub => sub.id === payload).shift();
    }
    let formLoad = {
      sid: payload.attributes.sid,
      preferredName: payload.attributes.preferredName,
      casrn: payload.attributes.casrn,
      substanceDescription: payload.attributes.description,
      privateQCNotes: payload.attributes.privateQcNote,
      publicQCNotes: payload.attributes.publicQcNote,
      qcLevelID: payload.relationships.qcLevel.data.id,
      sourceID: payload.relationships.source.data.id,
      substanceTypeID: payload.relationships.substanceType.data.id
    };
    commit("loadForm", formLoad);
  }
};

// getters
const getters = {
  getSubstance: (state, id) => {
    return state.list.filter(sub => sub.id === id);
  }
};

// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  clearForm(state) {
    state.form = {};
  },
  clearState(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
