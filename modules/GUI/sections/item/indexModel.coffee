Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/helpers.coffee"

module.exports = class ItemIndexModel extends Model
  constructor: (state = {}) ->
    super state

  getFields: -> @state.fields
  getUserFields: -> @state["user-fields"]

  setUserFields: (fields) -> @set "user-fields": fields

  updateUserFields: (userFields) -> @trigger "save-user-fields", @state.section, userFields
