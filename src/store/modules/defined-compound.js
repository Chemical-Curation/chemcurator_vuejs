import rootActions from "../actions.js";
import rootMutations from "../mutations.js";
import { HTTP } from "@/store/http-common";

const defaultState = () => {
  return {
    data: {},
    included: {},
    changed: false
  };
};

const state = defaultState();

// actions
const actions = {
  ...rootActions,
  getResourceURI: () => {
    return "definedCompounds";
  },
  fetchByMolfile: async ({ commit, dispatch }, searchString) => {
    await HTTP.get(
      `/definedCompounds?include=substance&filter[molfileV3000]=${encodeURI(
        searchString
      )}`
    )
      .then(response => {
        commit(`storeIncluded`, response.data.included);
        let obj = response.data.data.shift();
        let inc = response.data?.included;

        // TODO: The following action is because of the difference in what is returned
        //       by the list and detail serializers.  If the compound is a defined compound
        //       in order to load the additional data this response has to be thrown out
        //       and the GET needs to be repeated.  There may be ways around this with resolution
        //       or if the json:api id is the same as the cid being passed in.
        if (obj) {
          dispatch("getFetch", obj.id);
          if (inc) commit("substance/loadDetail", inc.shift(), { root: true });
        }
      })
      .catch(err => {
        const alert = {
          message: err.response.data.errors[0].detail,
          color: "warning",
          dismissCountDown: 4
        };
        dispatch("alert/alert", alert, {
          root: true
        });
      });
  }
};

const getters = {};

// mutations
const mutations = {
  ...rootMutations,
  clearState(state) {
    Object.assign(state, defaultState());
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
