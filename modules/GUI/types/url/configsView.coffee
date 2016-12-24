View = require "view.coffee"
modalWindowTemplate = require "types/url/modal"
Render = require "render"

module.exports = View
  initial: -> @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "click: [data-role='configs-url-field']": (e) -> @model.updateField e.target.value
    "submit: @configs-form": (e) ->
      @trigger "save-configs-modal", @model.getState()
      return false

  render: (state) -> @modalContain state
