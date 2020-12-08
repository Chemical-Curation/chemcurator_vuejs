import router from "@/router";
import { HTTP } from "../http-common";
import VueCookies from "vue-cookies";

const state = {
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  is_superuser: "",
  authenticated: false
};

// getters
const getters = {
  isAuthenticated: state => state.authenticated,
  isSuperuser: state => state.is_superuser === true
};

// actions
const actions = {
  fetchUser: async ({ commit, dispatch }) => {
    await HTTP.get("/login/")
      .then(response => {
        commit("setUser", response.data);
        commit("authenticate", true);
      })
      .catch(() => {
        let username = VueCookies.get("username");
        let password = VueCookies.get("password");
        if (username && password) {
          let form = {
            username: username,
            password: password
          };
          dispatch("login", form);
        } else {
          commit("authenticate", false);
        }
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
    commit("authenticate", true);
    router.push(sessionStorage.getItem('redirectPath') || "/").catch(() => {});
    sessionStorage.removeItem('redirectPath');
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
        commit("authenticate", false);
        VueCookies.remove("username");
        VueCookies.remove("password");
        router
          .push({
            name: "home"
          })
          .catch(() => {});
        dispatch("alert/alert", alert, {
          root: true
        });
      })
      .catch(() => {
        commit("setUser", {});
        commit("authenticate", false);
        router
          .push({
            name: "home"
          })
          .catch(() => {});
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
  },
  authenticate(state, authenticated) {
    state.authenticated = authenticated;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
