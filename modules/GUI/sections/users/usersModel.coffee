Model = require "libs/model.coffee"

module.exports = class UsersModel extends Model
  constructor: (state = {}) ->
    super state

  updateEmail: (email) ->
    @set
      email: email
      "is-valid-email": email.length > 0

  sendInvitation: -> @trigger "send-invitation", @state.email

  deleteInvitation: (email) -> @trigger "delete-invitation", email

  resetForm: ->
    @set
      email: ""
      "is-valid-email": false
