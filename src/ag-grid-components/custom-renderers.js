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

function SelectObjectCellEditor() {}

SelectObjectCellEditor.prototype.init = function(params) {
  this.eGui = document.createElement("select");
  this.eGui.style.width = "100%"
  this.eGui.style.height = "100%"
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
