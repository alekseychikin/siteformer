Model = require "libs/model.coffee"
{graph} = require "libs/helpers.coffee"

module.exports = class ProfileModel extends Model
  constructor: (state = {}) ->
    super state

  save: ->
    promises = []
    result =
      email: @email.get()
      role: @role.get()
      login: @login
      "save-profile": true

    graph.post
      "gui-profile": result
    .send()
    .then =>
      @trigger "profile-update"
      @email.hideError()
    .catch (response) =>
      if response.error.message?.code? && response.error.message.index[0] == "email"
        @email.showError response.error.message.code

  delete: (id) ->
    graph.post
      "gui-profile":
        "delete-profile": id
    .send()
    .then =>
      @trigger "profile-delete"
