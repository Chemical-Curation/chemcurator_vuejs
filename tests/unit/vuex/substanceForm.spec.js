import { substanceFormFromRelationship } from "@/store/getters";

describe("test get substance form from relationships", () => {
  it("returns and empty form", () => {
    const state = {};

    expect(substanceFormFromRelationship(state)).toStrictEqual({
      sid: "",
      preferredName: "",
      casrn: "",
      substanceDescription: "",
      privateQCNotes: "",
      publicQCNotes: "",
      qcLevelID: "",
      sourceID: "",
      substanceTypeID: ""
    });
  });

  it("returns a blank form when included not found", () => {
    // Set sample state
    const state = {
      relationships: {
        substance: {
          data: [
            {
              type: "substance",
              id: "1"
            }
          ]
        }
      }
    };

    // Set response to sample state
    expect(substanceFormFromRelationship(state)).toStrictEqual({
      sid: "",
      preferredName: "",
      casrn: "",
      substanceDescription: "",
      privateQCNotes: "",
      publicQCNotes: "",
      qcLevelID: "",
      sourceID: "",
      substanceTypeID: ""
    });
  });

  it("returns a populated form", () => {
    // Set sample state
    const state = {
      included: {
        substance: {
          "1": {
            attributes: {
              sid: "DTXSID502000000",
              preferredName: "preferredName",
              casrn: "casrn",
              description: "substanceDescription",
              privateQcNote: "privateQCNotes",
              publicQcNote: "publicQCNotes"
            },
            relationships: {
              qcLevel: {
                data: {
                  type: "qcLevel",
                  id: "1"
                }
              },
              source: {
                data: {
                  type: "source",
                  id: "1"
                }
              },
              substanceType: {
                data: {
                  type: "substanceType",
                  id: "1"
                }
              }
            }
          }
        }
      },
      data: {
        relationships: {
          substance: {
            data: {
              type: "substance",
              id: "1"
            }
          }
        }
      }
    };

    // Set response to sample state
    expect(substanceFormFromRelationship(state)).toStrictEqual({
      sid: "DTXSID502000000",
      preferredName: "preferredName",
      casrn: "casrn",
      substanceDescription: "substanceDescription",
      privateQCNotes: "privateQCNotes",
      publicQCNotes: "publicQCNotes",
      qcLevelID: "1",
      sourceID: "1",
      substanceTypeID: "1"
    });
  });
});
