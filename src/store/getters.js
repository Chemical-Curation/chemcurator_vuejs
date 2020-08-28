export default {};

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

  if (
    !(
      state.relationships &&
      state.relationships.substance &&
      state.relationships.substance.data &&
      state.relationships.substance.data.length !== 0
    )
  ) {
    return blankForm;
  }

  // todo: if this is 1 to 1 we need to clarify that.
  let type = state.relationships.substance.data[0].type;
  let id = state.relationships.substance.data[0].id;

  // Resource not found in includes.  Return blank
  if (!(state.included && state.included[type] && state.included[type][id]))
    return blankForm;

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
