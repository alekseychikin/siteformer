View = require "view.coffee"
Render = require "render"
tableTemplate = require "sections/item/section-list"

module.exports = class ItemIndexView extends View
  constructor: (target, model) ->
    super target, model

    @renderTable = Render tableTemplate, (@contain.find "[data-role='section-list']")[0]

  events:
    "click: [data-role='config-user-fields']": (e) -> @trigger "open-user-fields-popup"

  render: (state) -> @renderTable state
