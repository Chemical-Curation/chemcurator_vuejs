import { shallowMount } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";

const wrapper = shallowMount(NavBar, {
  stubs: [
    "b-navbar",
    "b-nav-item",
    "b-navbar-nav",
    "b-collapse",
    "b-navbar-toggle",
    "b-navbar-brand",
    "router-link",
    "router-link",
    "b-form-input",
    "b-button",
    "b-nav-item-dropdown",
    "b-icon",
    "b-dropdown-item"
  ],
  computed: {
    isAuthenticated() {
      return true;
    },
    username() {
      return "karyn";
    }
  }
});

describe("NavBar", () => {
  it("displays a brand logo", () => {
    expect(wrapper.find("chemreglogo-stub").exists()).toBe(true); // the logo is being stubbed in
  });

  it("displays a search box to an authenticated user", () => {
    expect(wrapper.find(".search").exists()).toBe(true);
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
