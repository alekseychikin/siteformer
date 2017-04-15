Model = require "model.coffee"

module.exports = class UserFieldsModel extends Model
  constructor: (state = {"user-fields": [], fields: []}) ->
    super state

  getUserFields: -> @state["user-fields"]

  addField: (alias) ->
    field = @state.fields.find (field) -> field.alias == alias

    @set "user-fields": @state["user-fields"].concat field if field

  removeField: (alias) ->
    field = @state["user-fields"].find (field) -> field.alias == alias
    fields = @state["user-fields"].slice 0
    fields.splice (@state["user-fields"].indexOf field), 1 if field
    @set "user-fields": fields
