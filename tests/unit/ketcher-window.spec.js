import KetcherWindow from "@/components/KetcherWindow.vue";
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";
import { createLocalVue, mount } from "@vue/test-utils";

// Sample Molfile for testing purposes
const sampleMolfile = `
  Ketcher  8 42014 42D 1   1.00000     0.00000     0

  1  0  0     0  0            999 V2000
    7.2750   -6.4750    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
M  END
`;

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(BootstrapVue);

describe("KetcherWindow.vue", () => {
  let wrapper;
  let state;
  let store;
  let iframe;

  beforeEach(() => {
    state = {
      compound: {
        molfile: ""
      }
    };

    store = new Vuex.Store({
      state
    });

    iframe = document.createElement('iframe')
    document.body.appendChild(iframe)

    wrapper = mount(KetcherWindow, {
      computed: {
        ketcherFrame: function() {
          return iframe
        }
      },
      store,
      localVue
    });
  });

  it("updates textarea with molfile", () => {
    expect(wrapper.find("#ketcher-import-textarea").props().value).toBe("");
    wrapper.setData({ molfile: sampleMolfile });
    expect(wrapper.find("#ketcher-import-textarea").props().value).toBe(
      sampleMolfile
    );
  });

  it("loads compound from store", () => {
    expect(wrapper.vm.compound).toBe("");
    wrapper.vm.$store.state.compound.molfile = sampleMolfile;
    expect(wrapper.vm.compound).toBe(sampleMolfile);
  });

  it("updates molfile when ketcher posts a returnMolfile message", async () => {
    // Fake the iframe message and wait for async handling
    window.postMessage({ type: "returnMolfile", molfile: sampleMolfile }, "*");
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.vm.molfile).toBe(sampleMolfile);
  });

  it("posts Molfile to iframe when loadMolfile is called", async () => {
    wrapper.vm.$store.state.compound.molfile = sampleMolfile
    const spy = jest.fn();
    iframe.contentWindow.addEventListener("message", function(event) {
      if (event.data.type === 'importMolfile'){
        expect(event.data.molfile).toBe(sampleMolfile)
        spy();
      }
    }, false)

    wrapper.vm.loadMolfile()

    //wait for message to be received
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(spy).toBeCalled();
  });

  it("requests Molfile from iframe when exportMolfile is called", async () => {
    expect(wrapper.vm.$store.state.compound.molfile).toBe('');
    const spy = jest.fn();
    iframe.contentWindow.addEventListener("message", function(event) {
      if (event.data.type === 'exportMolfile'){
        spy();
      }
    }, false)

    wrapper.vm.exportMolfile()

    //wait for message to be received
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(spy).toBeCalled();
  });
});
