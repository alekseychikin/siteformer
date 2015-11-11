View = require "view.coffee"
Render = require "render.coffee"
configsTableModel = require "table/configsTableModel.coffee"

module.exports = View "TypeTableView",
  model: configsTableModel

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-table-rows": "changeConfigsTableRows"
    "change: @configs-table-columns": "changeConfigsTableColumns"
    "change: @configs-table-cell": (e) ->
      $cell = $ e.target
      configsTableModel.updateCellData ($cell.data "row"), ($cell.data "column"), ($cell.val())

    "keydown: @configs-table-rows": (e) ->
      @changeConfigsTableRows e
      if e.keyCode == 13 then e.preventDefault()

    "keydown: @configs-table-columns": (e) ->
      @changeConfigsTableColumns e
      if e.keyCode == 13 then e.preventDefault()

    "popup-close: contain": (e) -> @unbind()

  changeConfigsTableRows: (e) -> configsTableModel.updateRows e.target.value
  changeConfigsTableColumns: (e) -> configsTableModel.updateColumns e.target.value

  initial: ->
    @tbodyContain = Render ($ "@configs-table-tbody"), "types_table_tbody"

  initialRender: (state) ->
    (@contain.find "@configs-table-columns").val state.columns
    (@contain.find "@configs-table-rows").val state.rows
    @renderTable state

  renderColumns: "renderTable"
  renderRows: "renderTable"

  renderTable: (state) -> @tbodyContain.render data: state.defaultData

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsTableModel.getState()
    @unbind()
    return false
