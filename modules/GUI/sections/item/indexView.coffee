View = require "libs/view.coffee"
Render = require "libs/render"
tableTemplate = require "dist/sections/item/section-list.tmplt"

module.exports = class ItemIndexView extends View
  constructor: (target, model) ->
    super target, model

    @renderTable = Render tableTemplate, @contain.querySelector "[data-role='section-list']"

  events:
    "click: [data-role='config-user-fields']": (e) -> @trigger "open-user-fields-popup"

  render: (state) -> @renderTable state
