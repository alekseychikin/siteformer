View = require "libs/view.coffee"
render = require "libs/render"

module.exports = class UsersModel extends View
  constructor: (target, model) ->
    super target, model

  events:
    "submit: [data-role='profile-form']": (e) ->
      @model.save()
      e.preventDefault()
