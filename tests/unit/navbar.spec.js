import {
  shallowMount,
  createLocalVue
} from "@vue/test-utils";
import Vuex from "vuex";
import NavBar from "@/components/NavBar.vue";
import auth from '@/store/modules/auth'

const localVue = createLocalVue()
localVue.use(Vuex);

const store = new Vuex.Store({
  computed: {
    username: "alice",
    isAuthenticated: "true",
  },
  modules: {
    auth: {
      state: auth.state,
      actions: auth.actions,
      getters: auth.getters
    },
  }
})

const wrapper = shallowMount(NavBar, {
  store,
  localVue
})

describe('NavBar', () => {

  it('displays a search box to an authenticated user', () => {
    expect(wrapper.find("search").exists()).toBe(true)
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
