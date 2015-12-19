View = require "view.coffee"
indexModel = require "./indexModel.coffee"
sectionsTemplate = require "sections/configs/table-sections-list.tmpl.js"
Render = require "render"

module.exports = View "indexView",
  contain: ($ "@sections")
  model: indexModel

  initial: ->
    @templateList = Render sectionsTemplate, @contain[0]

  events:
    "change: @check-item": (e) ->
      indexModel.setCheck ($ e.target).closest("@section-row").attr("data-id"), e.target.checked
    "change: @cbeck-all": (e) ->
      indexModel.checkAll e.target.checked
    "submit: @bottom-form": (e) ->
      indexModel.removeSubmit()
      false

  render: (state) ->
    @templateList state
