View = require "libs/view.coffee"
Render = require "libs/render"
modalWindowTemplate = require "dist/types/table/modal.gutt"

module.exports = class TableConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-table-rows']": "changeConfigsTableRows"
    "change: [data-role='configs-table-columns']": "changeConfigsTableColumns"
    "change: [data-role='configs-table-cell']": (e) ->
      @model.updateCellData (e.target.getAttribute "data-row"),
        e.target.getAttribute "data-column"
        e.target.value

    "keydown: [data-role='configs-table-rows']": (e) ->
      @changeConfigsTableRows e

      if e.keyCode == 13 then e.preventDefault()

    "keydown: [data-role='configs-table-columns']": (e) ->
      @changeConfigsTableColumns e

      if e.keyCode == 13 then e.preventDefault()

    "popup-close: contain": (e) -> @destroy()

  changeConfigsTableRows: (e) -> @model.updateRows e.target.value
  changeConfigsTableColumns: (e) -> @model.updateColumns e.target.value

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    e.preventDefault()
