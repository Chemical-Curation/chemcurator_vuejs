const defaultState = () => {
  return {
    attributes: {},
    relationships: {},
    included: []
  };
};

const state = defaultState();
// actions
const actions = {
};

const getters = {
  getSubstanceForm: state => {
    state  // REMOVE THIS LINE.  IT IS ONLY MEANT TO ALLOW LINTING
    return {
      sid: "Fart",
      preferredName: "",
      casrn: "",
      qcLevel: "",
      source: "",
      substanceType: "",
      substanceDescription: "",
      privateQCNotes: "",
      publicQCNotes: ""
    }
  }
};

// mutations
const mutations = {
  clearState(state) {
    Object.assign(state, defaultState());
  },
  setAttributes(state, { attributes, relationships }) {
    state.attributes = attributes;
    state.relationships = relationships;
  },
  setIncluded(state, included) {
    /** todo: this probably needs to place these attributes next to the relationships **/
    state.included = included;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
