Render = require "libs/render"
View = require "libs/view.coffee"
menuTemplate = require "dist/components/menu/menu-items.gutt"

module.exports = class SectionsMenuView extends View
  constructor: (target, model) ->
    super target, model

    @menuTemplate = Render menuTemplate, @contain

  render: (state) -> @menuTemplate state
