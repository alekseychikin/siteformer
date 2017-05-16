Model = require "libs/model.coffee"
{graph} = require "libs/helpers.coffee"

module.exports = class ProfileModel extends Model
  constructor: (state = {}) ->
    super state

  save: ->
    promises = []
    result =
      email: @email.get()
      password: @password.get()

    Promise.resolve @userpic.get()
    .then (userpicPath) =>
      result.userpic = userpicPath
    .then =>
      graph.post
        "gui-profile": result
      .send()
    .then =>
      @trigger "profile-update"
      @email.hideError()
    .catch (response) =>
      if response.error.message?.code? && response.error.message.index[0] == "email"
        @email.showError response.error.message.code
