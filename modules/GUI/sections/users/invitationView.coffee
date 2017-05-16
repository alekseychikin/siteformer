View = require "libs/view.coffee"

module.exports = class InvitationView extends View
  constructor: (target, model) ->
    super target, model

  events:
    "submit: contain": (e) ->
      @model.createAccount()
      e.preventDefault()
      return false
