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
  };
};

const state = defaultState();

let actions = {
  ...rootActions,
  async getObject(context, id) {
    await HTTP.get(`/lists/${id}`).then(response => {
      context.commit("setAttributes", response.data.data);
    });
  },
  getResourceURI: () => {
    return "lists";
  }
};

const getters = {
  getListDetailsForm: state => {
    if (
      state.attributes === {} ||
      !state.relationships.listAccessibility ||
      !state.relationships.types
    ) {
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
      };
    }

    let attributes = state.attributes;
    let relationships = state.relationships;

    console.log(relationships.types.data.map(x => x.id));

    return {
      name: attributes.name,
      label: attributes.label,
      shortDescription: attributes.shortDescription,
      longDescription: attributes.longDescription,
      listAccessibility: relationships.listAccessibility.data.id,
      owners: relationships.owners,
      sourceUrl: attributes.sourceUrl,
      sourceReference: attributes.sourceReference,
      sourceDoi: attributes.sourceDoi,
      externalContact: relationships.externalContact,
      dateOfSourceCollection: attributes.dateOfSourceCollection,
      types: relationships.types.data.map(x => x.id)
    };
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
