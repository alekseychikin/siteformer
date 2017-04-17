Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/ajax.coffee"

module.exports = class ItemIndexModel extends Model
  constructor: (state = {}) ->
    super state

    httpGet window.location.href
      .then (response) => @replace response

  getFields: -> @state.fields
  getUserFields: -> @state["user-fields"]

  setUserFields: (fields) -> @set "user-fields": fields

  updateUserFields: (userFields) ->
    httpPost "/?graph",
      "gui-fields": JSON.stringify
        usersonly: true
        section: @state.section
        fields:  userFields
    @set "user-fields": userFields
