import KetcherWindow from "@/components/KetcherWindow.vue";
import Vuex from 'vuex'
import BootstrapVue from "bootstrap-vue";
import {createLocalVue, mount} from "@vue/test-utils";


// Sample Molfile for testing purposes
const sampleMolfile = `
  Ketcher  8 42014 42D 1   1.00000     0.00000     0

  1  0  0     0  0            999 V2000
    7.2750   -6.4750    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
M  END
`;

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(BootstrapVue)


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

    wrapper = mount(KetcherWindow, {
      store,
      localVue,
    })
  })

  it("updates textarea with molfile", () => {
    expect(wrapper.find('#ketcher-import-textarea').props().value).toBe('')
    wrapper.setData({ molfile: sampleMolfile})
    expect(wrapper.find('#ketcher-import-textarea').props().value).toBe('Molfile')
  })
})
