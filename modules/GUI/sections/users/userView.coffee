View = require "libs/view.coffee"
render = require "libs/render"

module.exports = class ProfileModel extends View
  constructor: (target, model) ->
    super target, model

  events:
    "submit: [data-role='user-form']": (e) ->
      @model.save()
      e.preventDefault()

    "click: [data-role='delete']": (e) ->
      @model.delete Number e.target.getAttribute "data-id"
