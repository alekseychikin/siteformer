View = require "libs/view.coffee"
Render = require "libs/render"
template = require "dist/components/menu/menu-items.gutt"

module.exports = class MenuItemsView extends View
  constructor: (target, model) ->
    super target, model

    @renderMenu = Render template, @contain

  render: (state) -> @renderMenu state
