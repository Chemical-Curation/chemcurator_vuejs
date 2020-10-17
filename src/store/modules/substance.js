import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const state = {
  loading: false,
  count: 0,
  list: [],
  form: {}
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substances";
  },
  loadForm({ commit }, payload) {
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

// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  clearForm(state) {
    state.form = {};
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
