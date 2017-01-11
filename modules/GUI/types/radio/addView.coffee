View = require "view.coffee"

module.exports = class RadioDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='radio']": (e) ->
      @model.update Number(e.target.getAttribute "data-index")
