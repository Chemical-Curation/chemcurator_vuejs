const defaultState = () => {
  return {
    attributes: {},
    relationships: {},
    included: []
  };
};

const state = defaultState();
// actions
const actions = {};

const getters = {
  getSubstanceForm: state => {
    if (state.relationships.substance === undefined) {
      return {
        sid: "",
        preferredName: "",
        casrn: "",
        substanceDescription: "",
        privateQCNotes: "",
        publicQCNotes: "",
        qcLevelID: "",
        sourceID: "",
        substanceTypeID: ""
      }
    }
    // todo: if this is 1 to 1 we need to clarify that.
    let type = state.relationships.substance.data[0].type
    let id = state.relationships.substance.data[0].id

    let attributes = state.included[type][id].attributes
    let relationships = state.included[type][id].relationships
    return {
      sid: attributes.sid,
      preferredName: attributes.preferredName,
      casrn: attributes.casrn,
      substanceDescription: attributes.description,
      privateQCNotes: attributes.privateQcNote,
      publicQCNotes: attributes.publicQcNote,
      qcLevelID: relationships.qcLevel.data.id,
      sourceID: relationships.source.data.id,
      substanceTypeID: relationships.substanceType.data.id
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
