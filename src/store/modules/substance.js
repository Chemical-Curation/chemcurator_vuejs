import rootActions from "../actions.js";
import rootMutations from "../mutations.js";

const state = {
  loading: false,
  count: 0,
  list: [],
  form: {
    sid: "",
    preferredName: "",
    casrn: "",
    qcLevel: "",
    source: "",
    substanceType: "",
    substanceDescription: "",
    privateQCNotes: "",
    publicQCNotes: ""
  },
  savedData: {
    type: "substance",
    attributes: {},
    relationships: {}
  },
  btnDisabled: true,
  validated: {
    sid: null,
    preferredName: null,
    casrn: null,
    qcLevel: null,
    source: null,
    substanceType: null,
    substanceDescription: null,
    privateQCNotes: null,
    publicQCNotes: null
  },
  obj: {}
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
      sid: payload.attributes.sid,
      preferredName: payload.attributes.preferredName,
      casrn: payload.attributes.casrn,
      qcLevel: payload.relationships.qcLevel.data.id,
      source: payload.relationships.source.data.id,
      substanceType: payload.relationships.substanceType.data.id,
      substanceDescription: payload.attributes.description,
      privateQCNotes: payload.attributes.privateQcNote,
      publicQCNotes: payload.attributes.publicQcNote
    };
    commit("loadForm", formLoad);
    commit("clearPayload");
  }
};

// getters
const getters = {
  getForm: state => state.form,
  getValid: state => {
    if (Object.keys(state.validated).length) {
      return true;
    } else {
      return null;
    }
  }
};
// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  loadErrors(state, {key, value}) {
    state.obj[key] = value;
  },
  formChecked(state, {key, value}) {
    state.validated[key] = value;
  },
  updatePayload(state, { key, value }) {
    if (["qcLevel", "source","substanceType"].includes(key)) {
      if (state.savedData[key] !== value) {
        let obj = {data: {type: key, id: value}}
        state.savedData.relationships[key] = obj;
      }
    } else {
      state.savedData.attributes[key] = value;
    }
    if (state.form.sid) {
      state.savedData["id"] = state.form.sid;
    }
    state.btnDisabled  = false;
  },
  clearPayload(state) {
    let emptyData = {
      type: "substance",
      attributes: {},
      relationships: {}
    }
    state.savedData = emptyData;
    state.btnDisabled = true;
  },
  clearForm(state) {
    state.form = {};
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
