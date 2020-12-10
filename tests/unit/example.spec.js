import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import NavBar from "@/components/NavBar.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

describe("NavBar.vue", () => {
  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
