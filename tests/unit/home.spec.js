import Home from "@/views/Home.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);
localVue.use(VueCookies);

// Fake Vuex
let state = {
  count: 10
};
let actions = {
  getList() {}
};

let compound = {
  namespaced: true,
  state,
  actions
};
let substance = {
  namespaced: true,
  state,
  actions
};
let list = {
  namespaced: true,
  state,
  actions
};

let store = new Vuex.Store({
  modules: {
    compound,
    substance,
    list
  }
});

const wrapper_auth = mount(Home, {
  localVue,
  store,
  computed: {
    isAuthenticated() {
      return true;
    },
    username() {
      return "karyn";
    }
  }
});

const wrapper_noauth = mount(Home, {
  localVue,
  store,
  computed: {
    isAuthenticated() {
      return false;
    },
    username() {
      return "";
    }
  },
  stubs: ["b-icon"]
});

describe("Home.vue", () => {
  it("Displays the lorem ipsum", () => {
    expect(wrapper_noauth.find(".lead").text()).toContain(
      "Lorem ipsum dolor sit amet, "
    );
  });
  it("Displays the HelloWorld.vue message", () => {
    expect(
      wrapper_auth
        .find(".hello")
        .find("h1")
        .text()
    ).toBe("Welcome to ChemReg");
  });
  it("Does not display the login card when isAuthenticated is true", () => {
    expect(wrapper_auth.find("#login-card").exists()).toBe(false);
  });
  it("Displays the login card when isAuthenticated is not true", () => {
    expect(wrapper_noauth.find("#login-card").exists()).toBe(true);
  });
  it("Displays the list counts", () => {
    expect(wrapper_auth.find(".list-count").exists()).toBe(true);
  });
  it("Displays the substance counts", () => {
    expect(wrapper_auth.find(".substance-count").exists()).toBe(true);
  });
  it("Displays the compound counts", () => {
    expect(wrapper_auth.find(".compound-count").exists()).toBe(true);
  });
});
