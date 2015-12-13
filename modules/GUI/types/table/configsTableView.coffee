View = require "view.coffee"
configsTableModel = require "table/configsTableModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/table/modal.tmpl.js"

module.exports = View "TypeTableView",
  model: configsTableModel

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

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

  render: (state) ->
    @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsTableModel.getState()
    @unbind()
    return false
