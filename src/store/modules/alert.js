const state = {
  message: "",
  color: "",
  dismissCountDown: 0
};

// getters
const getters = {};

// actions
const actions = {
  alert(context, alert) {
    context.commit("addAlert", alert);
  }
};

// mutations
const mutations = {
  addAlert(state, alert) {
    state.message = alert.message;
    state.color = alert.color;
    state.dismissCountDown = alert.dismissCountDown;
  },
  setCountdown(state, dismissCountDown) {
    state.dismissCountDown = dismissCountDown;
  },
  clearState(state) {
    state.message = "";
    state.color = "";
    state.dismissCountDown = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
