import router from "@/router";
import { HTTP } from "../http-common";

const state = {
  email: "",
  firstName: "",
  lastName: "",
  username: ""
};

// getters
const getters = {
  isAuthenticated: state => !(state.username === "")
};

// actions
const actions = {
  fetchUser: async ({ commit, dispatch }) => {
    await HTTP.get("/login/")
      .then(response => commit("setUser", response.data))
      .catch(() => {
        const b = state.username.length === 0;
        const alert = {
          message: b
            ? "Please log in..."
            : `${state.username}, you are no longer logged in!`,
          color: b ? "success" : "danger",
          dismissCountDown: 4
        };
        commit("setUser", {});
        router.push("login");
        dispatch("alert/alert", alert, { root: true });
      });
  },
  login: async ({ commit }, { username, password }) => {
    const response = await HTTP.post(
      "/login/",
      {},
      {
        auth: { username: username, password: password }
      }
    );
    commit("setUser", response.data);
    router.push("/");
  },
  logout: async ({ commit }) => {
    await HTTP.delete("/login/")
      .then(() => {
        commit("setUser", {});
        router.push("login");
      })
      .catch(() => {
        commit("setUser", {});
        router.push("login");
      });
  }
};

// mutations
const mutations = {
  setUser(state, user) {
    state.email = user.email || "";
    state.firstName = user.first_name || "";
    state.lastName = user.last_name || "";
    state.username = user.username || "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
