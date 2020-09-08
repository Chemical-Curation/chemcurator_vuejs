import rootMutations from "@/store/mutations";

describe("test includes mutate properly", () => {
  it("mutates includes successfully", () => {
    let state = {};
    let payload = [
      {
        type: "type1",
        id: 1,
        attributes: {
          attr: "1"
        },
        relationships: {
          relationship1: {
            data: {
              type: "related",
              id: 1
            }
          }
        }
      },
      {
        type: "type1",
        id: 2,
        attributes: {
          attr: "1"
        },
        relationships: {
          relationship1: {
            data: {
              type: "related",
              id: 1
            }
          }
        }
      },
      {
        type: "type2",
        id: 1,
        attributes: {
          attr: "1"
        },
        relationships: {
          relationship1: {
            data: {
              type: "related",
              id: 1
            }
          }
        }
      }
    ];

    rootMutations.storeIncluded(state, payload);

    expect(state.included).toStrictEqual({
      type1: {
        1: {
          attributes: {
            attr: "1"
          },
          relationships: {
            relationship1: {
              data: {
                type: "related",
                id: 1
              }
            }
          }
        },
        2: {
          attributes: {
            attr: "1"
          },
          relationships: {
            relationship1: {
              data: {
                type: "related",
                id: 1
              }
            }
          }
        }
      },
      type2: {
        1: {
          attributes: {
            attr: "1"
          },
          relationships: {
            relationship1: {
              data: {
                type: "related",
                id: 1
              }
            }
          }
        }
      }
    });
  });

  it("handles no includes", () => {
    let state = {};
    let payload = undefined;

    rootMutations.storeIncluded(state, payload);

    expect(state.included).toBe(undefined);
  });
});
