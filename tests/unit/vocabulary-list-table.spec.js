import VocabularyListTable from "@/components/vocabulary/VocabularyListTable.vue";
import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(Vuex)
localVue.use(BootstrapVue);

// Mocks for tests
let wrapper;

let state = [
  {
    attributes: {
      label: 'Foobar',
      shortDescription: 'Foobar'
    }
  }
];

let actions = {
  getList() {}
};

let vocabularies = {
  namespaced: true,
  state,
  actions,
};

let store = new Vuex.Store({
  modules: {
    vocabularies
  }
});

describe("Lifecycle Tests", () => {
  it("calls getList on mount", () => {
    const spy = jest.spyOn(VocabularyListTable.methods, 'getList')
    wrapper = shallowMount(VocabularyListTable, {
      store,
      localVue
    });
    expect(spy).toBeCalled()
  });
});

describe("Test Component Functionality",() => {
  beforeEach(() => {
    wrapper = mount(VocabularyListTable, {
      store,
      localVue,
      propsData: {
        type: 'sources'
      }
    });
  })

  it("reloads table on prop change", () => {
    const spy = jest.spyOn(wrapper.vm, 'getList')
    wrapper.setProps({type: 'qcLevels'})
    expect(spy).toBeCalled()
  });

  it("has Name and Description table headers", () => {
    expect(wrapper.findAll('th').at(0).text()).toBe("Name")
    expect(wrapper.findAll('th').at(1).text()).toBe("Description")
  });
});
