import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";
import auth from "../../src/store/modules/auth";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("NavBar.vue", () => {
  // let actions;
  // let state;
  let store;

  beforeEach(() => {
    // state = {
    //   clicks: 2
    // };

    // actions = {
    //   moduleActionClick: jest.fn()
    // };

    store = new Vuex.Store({
      modules: {
        auth: {
          state: auth.state,
          actions: auth.actions,
          getters: auth.getters
        }
      }
    });
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });

  it("dispatches fetchCompound when search button is clicked", async () => {
    const wrapper = mount(NavBar, {
      store,
      localVue,
      stubs: [
        "b-navbar",
        "b-nav-item",
        "b-navbar-nav",
        "b-collapse",
        "b-navbar-toggle",
        "b-navbar-brand",
        "router-link",
        "router-link"
      ]
    });
    console.log(wrapper);
    wrapper.find("#search-button").trigger("click");
    await wrapper.vm.$nextTick();

    expect(store.dispatch).toHaveBeenCalledWith("compound/fetchCompound", {
      msg: "Test Namespaced Dispatch"
    });
  });
});
