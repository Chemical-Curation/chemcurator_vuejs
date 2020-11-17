import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

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

const state = {
  count: 0,
  detail: defaultDetail(),
  loading: false,
  list: [],
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substances";
  },
  loadDetail({ commit }, id) {
    let payload = state.list.filter(sub => sub.id === id).shift();
    commit("loadDetail", payload);
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
    }
  }
};

// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  loadDetail(state, payload) {
    state.detail = payload;
  },
  clearForm(state) {
    state.detail = defaultDetail();
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
