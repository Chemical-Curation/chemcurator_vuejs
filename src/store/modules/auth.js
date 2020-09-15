import router from "@/router";
import { HTTP } from "../http-common";

const state = {
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  is_superuser: ""
};

// getters
const getters = {
  isAuthenticated: state => !(state.username === ""),
  isSuperuser: state => state.is_superuser === true
};

console.log(state.is_superuser);

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
        router.push({
          name: "home"
        });
        dispatch("alert/alert", alert, {
          root: true
        });
      });
  },
  login: async ({ commit }, { username, password }) => {
    const response = await HTTP.post(
      "/login/",
      {},
      {
        auth: {
          username: username,
          password: password
        }
      }
    );
    commit("setUser", response.data);
    router.push("/");
  },
  logout: async ({ commit, dispatch }) => {
    const alert = {
      message: `${state.username}, you are no longer logged in!`,
      color: "warning",
      dismissCountDown: 4
    };
    await HTTP.delete("/login/")
      .then(() => {
        commit("setUser", {});
        router.push({
          name: "home"
        });
        dispatch("alert/alert", alert, {
          root: true
        });
      })
      .catch(() => {
        commit("setUser", {});
        router.push({
          name: "home"
        });
        dispatch("alert/alert", alert, {
          root: true
        });
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
    state.is_superuser = user.is_superuser || "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
