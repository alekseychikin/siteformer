Component = require "libs/component.coffee"
dispatcher = require "libs/dispatcher.coffee"

class SelectComponent extends Component
  selector: "[data-role='type-select']"

  constructor: ->
    super()

  events:
    "change: [data-role='select']": (e) ->
      dispatcher.action "field-change-value",
        type: "select"
        alias: e.target.name
        value: e.target.value

module.exports = new SelectComponent
