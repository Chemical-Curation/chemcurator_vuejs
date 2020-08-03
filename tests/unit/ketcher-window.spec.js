import KetcherWindow from "@/components/KetcherWindow.vue";
import Vuex from 'vuex'
import {createLocalVue, shallowMount} from "@vue/test-utils";

const localVue = createLocalVue()

localVue.use(Vuex)



describe ('KetcherWindow.vue', () =>{
  let wrapper;
  let state;
  let store;

  beforeEach(() => {
    state = {
      "compound": {
        "molfile": "",
      },
    }

    store = new Vuex.Store({
      state
    })

    wrapper = shallowMount(KetcherWindow, {
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
        "b-form-textarea",
        "b-button",
        "b-nav-item-dropdown",
        "b-icon",
        "b-dropdown-item"
      ],
      store,
      localVue,
    })
  })

  it("starts and stops interval on iframe load and destroy", () => {
    jest.useFakeTimers()
    const spy = jest.spyOn(wrapper.vm,"ketcherLoaded");
    wrapper.setMethods({"ketcherLoaded": spy})

    wrapper.find("#ketcher").trigger("load");
    expect(spy).toBeCalled();
    expect(setInterval).toHaveBeenCalled();

    wrapper.destroy();
    expect(clearInterval).toHaveBeenCalled();
  })
})
