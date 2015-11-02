Model = require "../../libs/sf-fe-module/model.coffee"
Promise = require "q"
httpGet = (require "../../libs/sf-fe-module/ajax.coffee").httpGet

module.exports = Model
  initialState: -> httpGet '/cms/configs/add/__json/'

  addField: (field) ->
    @set fields: @state.fields.concat [field]

  addEmptyField: ->
    @set fields: @state.fields.concat [
      title: ""
      alias: ""
      type: "string"
    ]

  updateTitle: (index, value) -> @state.fields[index].title = value

  updateAlias: (index, value) -> @state.fields[index].alias = value

  updateType: (index, value) -> @state.fields[index].type = value

  removeField: (index) ->
    @state.fields.splice index, 1
    @set fields: @state.fields
