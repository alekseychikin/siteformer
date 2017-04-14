View = require "view.coffee"
Render = require "render"
itemTemplate = require "types/section/item.tmplt"

module.exports = class SectionDataView extends View
  constructor: (target, model) ->
    super target, model

    @templateRender = Render itemTemplate, @contain

  events:
    "change input keyup: [data-role='section']": (e) ->
      if e.keyCode == 27 then @model.emptySearch() else @model.search e.target.value
    "click: [data-role='suggest-item']": (e) ->
      @model.selectResult Number(e.target.getAttribute "data-id"), e.target.getAttribute "data-title"
    "click: [data-role='cancel']": ->
      @model.emptyValue()
      setTimeout =>
        @contain.querySelector("[data-role='section']").focus()
      , 50

  render: (state) -> @templateRender state
