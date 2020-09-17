/**
 * This is an AG Grid cell renderer component that can take an id
 * and return the `attributes.label` instead of the id for display.
 *
 * This should be usable for Controlled vocabularies but will need
 * expansion on what the source field is if it will be used for
 * non-controlled vocabulary models.
 */
function MappableCellRenderer() {}

MappableCellRenderer.prototype.init = function(params) {
  this.eGui = document.createElement("span");
  if (
    (params.value !== "" ||
      params.value !== undefined ||
      params.value !== null) &&
    params.value in params.map
  ) {
    this.eGui.innerHTML = params.map[params.value].attributes.label;
  }
};

MappableCellRenderer.prototype.getGui = function() {
  return this.eGui;
};

/**
 * This is an AG Cell Editor using the select dropdown that allows
 * for both a value (id) and text (string) object to be passed in.
 *
 * The current AG Grid option only allows for text to be passed
 * in as an array which is unusable without a unique constraint.
 */
function SelectObjectCellEditor() {}

SelectObjectCellEditor.prototype.init = function(params) {
  this.eGui = document.createElement("select");
  this.eGui.style.width = "100%";
  this.eGui.style.height = "100%";
  for (let value of params.values) {
    if (
      params.value !== "" ||
      params.value !== undefined ||
      params.value !== null
    ) {
      let option = document.createElement("option");
      option.innerText = value.text;
      option.value = value.value;
      this.eGui.appendChild(option);
    }
  }
};

SelectObjectCellEditor.prototype.getGui = function() {
  return this.eGui;
};

SelectObjectCellEditor.prototype.getValue = function() {
  return this.eGui.value;
};

export { SelectObjectCellEditor, MappableCellRenderer };
