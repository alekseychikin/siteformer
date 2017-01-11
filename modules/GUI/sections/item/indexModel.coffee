Model = require "model.coffee"
{httpGet, httpPost} = require "ajax.coffee"

module.exports = class ItemIndexModel extends Model
  constructor: (state = {}) ->
    super state

    httpGet window.location.href
      .then (response) => @replace response

  getFields: -> @state.fields
  getUserFields: -> @state.user_fields

  setUserFields: (fields) -> @set user_fields: fields

  updateUserFields: (userFields) ->
    httpPost "/?graph",
      "gui-fields": JSON.stringify
        usersonly: true
        section: @state.section
        fields:  userFields
    @set user_fields: userFields
