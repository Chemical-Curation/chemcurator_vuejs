import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { HTTP } from "@/store/http-common";

const defaultDetail = () => {
  return {
    id: "",
    type: "",
    attributes: {
      preferredName: null,
      displayName: null,
      casrn: null,
      description: null,
      privateQcNote: null,
      publicQcNote: null
    },
    relationships: {
      source: {
        data: {
          id: null
        }
      },
      substanceType: {
        data: {
          id: null
        }
      },
      qcLevel: {
        data: {
          id: null
        }
      },
      associatedCompound: {
        data: null
      }
    }
  };
};

const defaultState = () => {
  return {
    detail: defaultDetail(),
    included: {},
    loading: false,
    count: 0,
    searchResults: [],
    list: []
  };
};

const state = defaultState();

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substances";
  },
  loadDetail({ commit }, id) {
    let payload = state.list.filter(sub => sub.id === id).shift();
    commit("loadDetail", payload);
  },
  fetchSubstance: async (context, sid) => {
    HTTP.get(`substances/${sid}`).then(res => {
      context.commit("loadDetail", res.data.data);
      let compound_id = res.data.data.relationships.associatedCompound.data.id;
      if (compound_id) {
        context.dispatch(
          "compound/fetchCompound",
          { id: compound_id },
          { root: true }
        );
      }
    });
  },
  storedSearch: async (context, substance) => {
    context.commit("selectSubstance", substance);
  },
  substanceSearch: async (context, { searchString }) => {
    // let resource = await context.dispatch("getResourceURI");
    let resource = "search";
    let promise = await HTTP.get(
      `/${resource}?filter[search]=${encodeURI(searchString)}`
    )
      .then(response => {
        if (response.data.data.length > 0) {
          let loaded_substance = response.data.data[0];
          context.commit("loadDetail", loaded_substance);
          let compound_id =
            loaded_substance.relationships.associatedCompound.data?.id;
          let compound_type =
            loaded_substance.relationships.associatedCompound.data?.type;

          context.commit("loadDetail", loaded_substance);
          context.commit("storeSearchResults", response.data.data);
          if (compound_id) {
            context.dispatch(
              `compound/fetchCompound`,
              { id: compound_id },
              { root: true }
            );
            return compound_type;
          } else {
            context.commit("compound/setType", "none", { root: true });
            context.commit("compound/definedcompound/setLoadable", false, {
              root: true
            });
            return false;
          }
        } else {
          // Handle no rows returned
          const alert = {
            message: `${searchString} not valid`,
            color: "warning",
            dismissCountDown: 4
          };
          // ?: should getting a failed search result clear what you have loaded?
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
    return promise;
  }
};

// mutations
const mutations = {
  ...rootMutations,
  loadDetail(state, payload) {
    state.detail = payload;
  },
  storeSearchResults(state, payload) {
    state.searchResults = payload;
  },
  clearDetail(state) {
    state.detail = defaultDetail();
  },
  clearState(state) {
    Object.assign(state, defaultState());
  },
  selectSubstance(state, substance) {
    state.detail = substance;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
