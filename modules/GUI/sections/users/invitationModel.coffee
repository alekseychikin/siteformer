Model = require "libs/model.coffee"

module.exports = class InvitationModel extends Model
  constructor: (state = {}) ->
    super state

  createAccount: -> @trigger "create-account"
