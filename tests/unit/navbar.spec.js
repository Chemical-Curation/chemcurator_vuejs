import {
  shallowMount,
} from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";

const wrapper = shallowMount(NavBar, {
  mocks: {
    $store: {
      state: {
        username: "alice",
        isAuthenticated: "true"
      }
    }
  },
})

describe('NavBar', () => {

  it('displays a search box to an authenticated user', () => {
    expect(wrapper.find("search").exists()).toBe(true)
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
