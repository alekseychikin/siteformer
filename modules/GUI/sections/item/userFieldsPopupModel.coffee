Model = require "model.coffee"

module.exports = Model
  defaultState:
    userFields: []
    fields: []

  getUserFields: -> @state.userFields

  addField: (alias) ->
    field = @state.fields.find (field) -> field.alias == alias

    @set userFields: @state.userFields.concat field if field

  removeField: (alias) ->
    field = @state.userFields.find (field) -> field.alias == alias
    fields = @state.userFields.slice 0
    fields.splice (@state.userFields.indexOf field), 1 if field
    @set userFields: fields
