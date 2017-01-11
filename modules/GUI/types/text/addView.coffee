View = require "view.coffee"

module.exports = class TextDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='area']": (e) -> @model.update e.target.value
