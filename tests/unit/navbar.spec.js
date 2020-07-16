import {
  shallowMount,
} from "@vue/test-utils";
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
    "router-link"
  ],
  computed: {
    isAuthenticated() {
      return true
    },
    username: "karyn",
    // username: {
    //   get: function () {
    //     return "karyn"
    //   },
    //   set: function (newName) {
    //     return yourNewName
    //   }
    // }
  }
})

console.log(wrapper.html({
  pretty: true
}))

describe('NavBar', () => {


  it('displays a brand logo', () => {
    expect(wrapper.find(".navbar-brand").exists()).toBe(true)
  });

  it('displays a search box to an authenticated user', () => {
    expect(wrapper.find(".search").exists()).toBe(true)
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
