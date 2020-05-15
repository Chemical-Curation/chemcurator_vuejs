describe("The home page", () => {
  before(() => {
    cy.adminLogin();
    cy.visit("/");
  });
  it("should have welcome msg", () => {
    cy.contains("h1", "Welcome to ChemReg");
  });
  it("should have dropdown", () => {
    cy.get("#compound-type-dropdown").contains("defined");
    cy.get("#compound-type-dropdown").contains("ill-defined");
  });
  it("should toggle ketcher/marvinjs on dropdown", () => {
    cy.get("#compound-type-dropdown").select("defined");
    cy.get("iframe[id=ketcher]");
    cy.get("#compound-type-dropdown").select("ill-defined");
    cy.get("iframe[id=marvin]");
  });
  it("marvinjs should have import/export functionality", () => {
    cy.get("#compound-type-dropdown")
      .select("ill-defined")
      .then(() => {
        cy.get("#marvin-export-button");
        cy.get("#marvin-import-textarea");
        cy.get("#marvin-import-button");
      });
  });
  it("marvinjs should be able to import/export mrvfiles", () => {
    var mrvfile =
      '<cml xmlns="http://www.chemaxon.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.chemaxon.com http://www.chemaxon.com/marvin/schema/mrvSchema_20_9_0.xsd"><MDocument><MChemicalStruct><molecule molID="m1"><atomArray><atom id="a1" elementType="O" x2="-0.3333333333333333" y2="0" lonePair="2"/></atomArray><bondArray/></molecule></MChemicalStruct><MElectronContainer occupation="0 0" radical="0" id="o1"><MElectron atomRefs="m1.a1" difLoc="0.0 0.0 0.0"/><MElectron atomRefs="m1.a1" difLoc="0.0 0.0 0.0"/></MElectronContainer><MElectronContainer occupation="0 0" radical="0" id="o2"><MElectron atomRefs="m1.a1" difLoc="0.0 0.0 0.0"/><MElectron atomRefs="m1.a1" difLoc="0.0 0.0 0.0"/></MElectronContainer></MDocument></cml>';
    cy.get("#compound-type-dropdown")
      .select("ill-defined")
      .then(() => {
        cy.get("#compound-type-dropdown").select("ill-defined");
        cy.get("#marvin-import-textarea").invoke("val", mrvfile);
        cy.get("#marvin-import-button").click();
      });

    // can't download files to check export
    // https://github.com/cypress-io/cypress/issues/949
  });
});
