import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    attributes: {},
    relationships: {},
    loaded: false,
    count: 0,
    list: []
  }
};

const state = defaultState();

let actions = {
  ...rootActions,
  async getObject(context, id) {
    await HTTP.get(`/lists/${id}`).then(response => {
      context.commit("setAttributes", response.data.data);
    });
  }
};

const getters = {
  getListDetailsForm: state => {
    if (state.attributes === {}) {
      return {
        name: "",
        label: "",
        shortDescription: "",
        longDescription: "",
        listAccessibility: "",
        owners: "",
        sourceUrl: "",
        sourceReference: "",
        sourceDoi: "",
        externalContact: "",
        dateOfSourceCollection: "",
        types: ""
      } 
    }

    let attributes = state.attributes
    // let relationships = state.relationships

    return {
      name: attributes.name,
      label: attributes.label,
      shortDescription: attributes.shortDescription,
      longDescription: attributes.longDescription,
      // listAccessibility: relationships.accesibilityType.data.id,
      listAccessibility: "",
      // owners: relationships.owners.data,
      owners: "",
      sourceUrl: attributes.sourceUrl,
      sourceReference: attributes.sourceReference,
      sourceDoi: attributes.sourceDoi,
      // externalContact: relationships.externalContact.data.id,
      externalContact: "",
      dateOfSourceCollection: attributes.dateOfSourceCollection,
      // types: relationships.listType.data.id
      types: ""
    }
  }
};

const mutations = {
  ...rootMutations,
  clearState(state) {
    Object.assign(state, defaultState());
  },
  setAttributes(state, { attributes, relationships }) {
    state.attributes = attributes;
    state.relationships = relationships;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
