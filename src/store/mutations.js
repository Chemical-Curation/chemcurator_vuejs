export default {
  storeList(state, payload) {
    state.list = payload;
  },
  storeCount(state, payload) {
    state.count = payload;
  },
  storeIncluded(state, payload) {
    if (payload) {
      state.included = {};
      for (let resource of payload) {
        if (state.included[resource.type] === undefined)
          state.included[resource.type] = {};
        state.included[resource.type][resource.id] = resource;
      }
    }
  },
  storeFetch(state, data) {
    state.data = data;
  },
  loading(state) {
    state.loading = true;
  },
  loaded(state) {
    state.loading = false;
  },
  setChanged(state, changed) {
    state.changed = changed;
  }
};
