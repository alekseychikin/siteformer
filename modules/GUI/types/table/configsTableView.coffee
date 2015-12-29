View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/table/modal.tmpl.js"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-table-rows": "changeConfigsTableRows"
    "change: @configs-table-columns": "changeConfigsTableColumns"
    "change: @configs-table-cell": (e) ->
      $cell = $ e.target
      @model.updateCellData ($cell.data "row"), ($cell.data "column"), ($cell.val())

    "keydown: @configs-table-rows": (e) ->
      @changeConfigsTableRows e
      if e.keyCode == 13 then e.preventDefault()

    "keydown: @configs-table-columns": (e) ->
      @changeConfigsTableColumns e
      if e.keyCode == 13 then e.preventDefault()

    "popup-close: contain": (e) -> @destroy()

  changeConfigsTableRows: (e) -> @model.updateRows e.target.value
  changeConfigsTableColumns: (e) -> @model.updateColumns e.target.value

  render: (state) ->
    @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
