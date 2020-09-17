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
  }
};

export function substanceFormFromRelationship(state) {
  let blankForm = {
    sid: "",
    preferredName: "",
    casrn: "",
    substanceDescription: "",
    privateQCNotes: "",
    publicQCNotes: "",
    qcLevelID: "",
    sourceID: "",
    substanceTypeID: ""
  };

  if (!state.data?.relationships?.substance?.data) return blankForm;

  let type = state.data.relationships.substance.data.type;
  let id = state.data.relationships.substance.data.id;

  // Resource not found in includes.  Return blank
  if (!state.included?.[type]?.[id]) return blankForm;

  let attributes = state.included[type][id].attributes;
  let relationships = state.included[type][id].relationships;
  return {
    sid: attributes.sid,
    preferredName: attributes.preferredName,
    casrn: attributes.casrn,
    substanceDescription: attributes.description,
    privateQCNotes: attributes.privateQcNote,
    publicQCNotes: attributes.publicQcNote,
    qcLevelID: relationships.qcLevel.data.id,
    sourceID: relationships.source.data.id,
    substanceTypeID: relationships.substanceType.data.id
  };
}
