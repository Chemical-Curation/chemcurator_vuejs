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
  fetchUser: async ({ commit }) => {
    try {
      const response = await HTTP.get("/login/");
      commit("setUser", response.data);
    } catch {
      commit("setUser", {});
    }
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
    await HTTP.delete("/login/");
    commit("setUser", {});
    router.push("login");
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
