export default {
  storeList(state, payload) {
    state.list = payload;
  },
  storeCount(state, payload) {
    state.count = payload;
  },
  storeIncluded(state, payload) {
    let resource;
    state.included = {};
    for (resource of payload) {
      if (state.included[resource.type] === undefined)
        state.included[resource.type] = {};
      state.included[resource.type][resource.id] = {
        attributes: resource.attributes,
        relationships: resource.relationships
      };
    }
  },
  storeFetch(state, { attributes, relationships }) {
    state.attributes = attributes;
    state.relationships = relationships;
  },
  clearState(state) {
    Object.assign(state, {});
  }
};
