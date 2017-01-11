View = require "view.coffee"
modalWindowTemplate = require "types/url/modal"
Render = require "render"

module.exports = class UrlConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain[0]
    @render @model.state

  events:
    "click: [data-role='configs-url-field']": (e) -> @model.updateField e.target.value
    "submit: [data-role='configs-form']": (e) ->
      @trigger "save-configs-modal", @model.getState()
      return false

  render: (state) -> @modalContain state
