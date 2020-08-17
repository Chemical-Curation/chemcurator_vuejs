import Home from "@/views/Home.vue";
import {
  createLocalVue,
  mount
} from "@vue/test-utils";
import BootstrapVue, {
  LayoutPlugin,
  CardPlugin
} from 'bootstrap-vue';

const localVue = createLocalVue()
localVue.use(BootstrapVue);

const wrapper = mount(Home, {
  localVue,
  computed: {
    isAuthenticated() {
      return true;
    },
    username() {
      return "karyn";
    }
  }
});

describe("Home.vue", () => {
  it("Displays the HelloWorld.vue message", () => {
    expect(wrapper.find(".hello").find("h1").text()).toBe("Welcome to ChemReg")
  })
  it("Does not display the login card when isAuthenticated is true", () => {
    expect(wrapper.find("#login-card").exists()).toBe(false)
  })
  it("Displays the list counts", () => {
    expect(wrapper.find(".list-count").exists()).toBe(true)
  })
  it("Displays the substance counts", () => {
    expect(wrapper.find(".substance-count").exists()).toBe(true)
  })
  it("Displays the compound counts", () => {
    expect(wrapper.find(".compound-count").exists()).toBe(true)
  })
});
