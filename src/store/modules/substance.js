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
    preferredName: null,
    casrn: null,
    qcLevel: null,
    source: null,
    substanceType: null,
    substanceDescription: null,
    privateQCNotes: null,
    publicQCNotes: null
  },
  errors: {}
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
    let { id } = payload;
    console.log(id);
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
    commit("clearValidated");
  }
};

// getters
const getters = {
  getForm: state => state.form,
  getValid: state => (key) => {
    return state.validated[key];
  }
};
// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  loadErrors(state, errors) {
    state.errors = errors;
    Object.keys(state.validated).forEach((key) => {
      if (state.validated[key] === null) {
        state.validated[key] = true
      }
    })
  },
  formChecked(state, {key, value}) {
    state.validated[key] = value;
  },
  clearValidated(state) {
    state.validated = {
      preferredName: null,
      casrn: null,
      qcLevel: null,
      source: null,
      substanceType: null,
      substanceDescription: null,
      privateQCNotes: null,
      publicQCNotes: null
    }
  },
  updatePayload(state, { field, inputText }) {
    if (["qcLevel", "source","substanceType"].includes(field)) {
      if (state.savedData[field] !== inputText) {
        let obj = {data: {type: field, id: inputText}}
        state.savedData.relationships[field] = obj;
      }
    } else {
      state.savedData.attributes[field] = inputText;
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
