import VocabularyListTable from "@/components/vocabulary/VocabularyListTable.vue";
import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(Vuex)
localVue.use(BootstrapVue);

// Mocks for tests
let wrapper;

let state = {
  list: [
    {
      attributes: {
        label: 'Sample Label',
        shortDescription: 'Sample Description'
      }
    }
  ]
};

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

  it("loads data from vocabularyList", () => {
    expect(wrapper.findAll('td').at(0).text()).toBe(state.list[0].attributes.label)
    expect(wrapper.findAll('td').at(1).text()).toBe(state.list[0].attributes.shortDescription)

    let updatedList = {
      attributes: {
        label: 'New Label',
        shortDescription: 'New Description'
      }
    }
    wrapper.vm.$store.state.vocabularies.list = [updatedList]

    expect(wrapper.findAll('td').at(0).text()).toBe(updatedList.attributes.label)
    expect(wrapper.findAll('td').at(1).text()).toBe(updatedList.attributes.shortDescription)
  });
});
