import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const defaultForm = () => {
  return {
    sid: "",
    preferredName: "",
    casrn: "",
    qcLevel: "",
    source: "",
    substanceType: "",
    description: "",
    privateQCNote: "",
    publicQCNote: ""
  };
};

const state = {
  loading: false,
  count: 0,
  list: [],
  form: defaultForm()
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "substances";
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
      sid: payload.id, // sid
      preferredName: payload.attributes.preferredName,
      casrn: payload.attributes.casrn,
      qcLevel: payload.relationships.qcLevel.data.id,
      source: payload.relationships.source.data.id,
      substanceType: payload.relationships.substanceType.data.id,
      description: payload.attributes.description,
      privateQCNote: payload.attributes.privateQcNote,
      publicQCNote: payload.attributes.publicQcNote
    };
    commit("loadForm", formLoad);
  }
};

// getters
const getters = {
  getForm: state => state.form,
};
// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  clearForm(state) {
    state.form = defaultForm();
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
