const state = {
  user: ""
};

// getters
const getters = {
  isLoggedIn: state => !!state.user
};

// actions
const actions = {
  logout({ commit }) {
    commit("LOGOUT");
  },
  login({ commit }, user) {
    commit("SET_USER", user);
  }
};

// mutations
const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  LOGOUT(state) {
    state.user = "";
  },
  CYPRESS_SET_USER(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
