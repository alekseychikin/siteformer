Component = require "libs/component.coffee"
dispatcher = require "libs/dispatcher.coffee"

class StringItem extends Component
  selector: "[data-role='type-string']"

  constructor: ->
    super()

  events:
    "input: [data-role='input']": (e) ->
      dispatcher.action "field-change-value",
        type: "string"
        alias: e.target.name
        value: e.target.value

module.exports = new StringItem
