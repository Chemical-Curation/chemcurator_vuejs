import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { HTTP } from "@/store/http-common";
import router from "@/router";

const defaultDetail = () => {
  return {
    id: "",
    type: "",
    attributes: {
      preferredName: "",
      casrn: "",
      description: "",
      privateQCNote: "",
      publicQCNote: ""
    },
    relationships: {
      source: {
        data: {
          id: ""
        }
      },
      substanceType: {
        data: {
          id: ""
        }
      },
      qcLevel: {
        data: {
          id: ""
        }
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
  loadDetail({ commit }, id) {
    let payload = state.list.filter(sub => sub.id === id).shift();
    commit("loadDetail", payload);
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
            loaded_substance.relationships.associatedCompound.data?.id;

          context.commit("loadDetail", loaded_substance);
          if (compound_id) {
            context.dispatch(
              `compound/fetchCompound`,
              { id: compound_id },
              { root: true }
            );
          }
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
  }
};

// getters
const getters = {
  form: state => {
    let { detail } = state;
    return {
      id: detail.id, // sid
      preferredName: detail.attributes.preferredName,
      casrn: detail.attributes.casrn,
      qcLevel: detail.relationships.qcLevel.data.id,
      source: detail.relationships.source.data.id,
      substanceType: detail.relationships.substanceType.data.id,
      description: detail.attributes.description,
      privateQCNote: detail.attributes.privateQcNote,
      publicQCNote: detail.attributes.publicQcNote
    };
  }
};

// mutations
const mutations = {
  ...rootMutations,
  loadDetail(state, payload) {
    state.detail = payload;
  },
  clearForm(state) {
    state.detail = defaultDetail();
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
