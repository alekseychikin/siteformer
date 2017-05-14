Model = require "libs/model.coffee"
{httpPost} = require "libs/ajax.coffee"

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
      httpPost "/index.php?graph", "gui-profile": JSON.stringify result
      .then =>
        @trigger "profile-update"
        @email.hideError()
    .catch (response) =>
      if response.error.message?.code? && response.error.message.index[0] == "email"
        @email.showError response.error.message.code
