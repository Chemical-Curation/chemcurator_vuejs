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
    qcLevelID: "",
    sourceID: "",
    substanceTypeID: "",
    substanceDescription: "",
    privateQCNotes: "",
    publicQCNotes: ""
  },
  savedData: {
    type: "substance",
    attributes: {},
    relationships: {}
  },
  btnDisabled: true
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
      qcLevelID: payload.relationships.qcLevel.data.id,
      sourceID: payload.relationships.source.data.id,
      substanceTypeID: payload.relationships.substanceType.data.id,
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
};

// mutations
const mutations = {
  ...rootMutations,
  loadForm(state, obj) {
    state.form = obj;
  },
  updatePayload(state, { key, value }) {
    if (["qcLevelID", "sourceID","substanceTypeID"].includes(key)) {
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
