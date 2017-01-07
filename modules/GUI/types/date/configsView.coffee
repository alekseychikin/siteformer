View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/date/modal"

module.exports = View
  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-date-use-time']": (e) -> @model.updateUseTime e.target.checked
    "change: [data-role='configs-date-use-current-date']": (e) -> @model.updateUseCurrentDate e.target.checked
    "popup-close: contain": (e) -> @destroy()

  initial: -> @modalContain = Render modalWindowTemplate, @contain[0]

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
