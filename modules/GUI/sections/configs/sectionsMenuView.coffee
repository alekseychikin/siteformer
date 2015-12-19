Render = require "render"
View = require "view.coffee"
IndexModel = require "./indexModel.coffee"
menuTemplate = require "components/menu/menu-items.tmpl.js"

module.exports = View "sectioneMenuView",
  contain: $ "@sections-menu"
  initial: ->
    @menuTemplate = Render menuTemplate, @contain[0]
  model: IndexModel
  render: (state) -> @menuTemplate state
