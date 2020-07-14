import {
  shallowMount
} from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";

const wrapper = shallowMount(NavBar)

describe('NavBar', () => {

  it('has no search class by default', () => {
    expect(wrapper.hasClass('search')).to.be.false;
  });

  it("provides ability to logout", () => {
    expect(typeof NavBar.methods.logout).toBe("function");
  });
});
