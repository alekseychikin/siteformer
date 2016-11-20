View = require "view.coffee"
sectionsTemplate = require "sections/configs/table-section-list"
Render = require "render"

module.exports = View
  initial: ->
    @templateList = Render sectionsTemplate, @contain[0]

  events:
    "change: @check-item": (e) ->
      @model.setCheck ($ e.target).closest("@section-row").attr("data-id"), e.target.checked
    "change: @cbeck-all": (e) ->
      @model.checkAll e.target.checked
    "submit: @bottom-form": (e) ->
      @model.removeSubmit()
      false

  render: (state) -> @templateList state
