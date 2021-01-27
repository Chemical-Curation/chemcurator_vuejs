import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import rootGetters from "@/store/getters";

const state = {
  loading: false,
  count: 0,
  list: []
};

// actions
let actions = {
  ...rootActions,
  getResourceURI: () => {
    return "relationshipTypes";
  }
};

// getters
let getters = {
  ...rootGetters,
  /**
   * Overrides the getOptions to return both the label and correlary label.
   * @param state
   * @return {function(*): {disabled: boolean|*, text: *, value: *}[]}
   */
  getOptions: state => selected => {
    return state.list
      .filter(item => {
        return !item.attributes.deprecated || item.id === selected;
      })
      .flatMap(item => {
        return [
          {
            value: { id: item.id, reverse: false },
            text: item.attributes.label,
            disabled: item.attributes.deprecated
          },
          {
            value: { id: item.id, reverse: true },
            text: item.attributes.corrolaryLabel,
            disabled: item.attributes.deprecated
          }
        ];
      });
  }
};

// mutations
const mutations = {
  ...rootMutations
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
