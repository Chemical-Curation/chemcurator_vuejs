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
    state.included = included;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
