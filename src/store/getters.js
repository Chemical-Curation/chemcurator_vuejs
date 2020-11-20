export default {
  getIncluded: state => type => {
    let these = [];
    let obj;
    if (state.data.relationships[type]) {
      obj = state.data.relationships[type].data;
    } else {
      obj = [];
    }
    if (Array.isArray(obj)) {
      for (let o of obj) {
        these.push({ id: o.id, type: o.type, ...state.included[o.type][o.id] });
      }
    } else {
      these = {
        id: obj.id,
        type: obj.type,
        ...state.included[obj.type][obj.id]
      };
    }
    return these;
  },
  getOptions: state => selected => {
    return state.list
      .filter(item => {
        return !item.attributes.deprecated || item.id === selected;
      })
      .map(item => {
        return {
          value: item.id,
          text: item.attributes.label,
          disabled: item.attributes.deprecated
        };
      });
  }
};
