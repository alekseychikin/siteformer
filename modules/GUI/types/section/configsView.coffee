View = require "libs/view.coffee"
Render = require "libs/render"
modalWindowTemplate = require "dist/types/section/modal.tmplt"

module.exports = class SectionConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-section-section']": (e) -> @model.updateSection e.target.value
    "change: [data-role='configs-section-field']": (e) -> @model.updateField e.target.value
    "popup-close: contain": (e) -> @destroy()


  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    e.preventDefault()
