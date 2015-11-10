Model = require "model.coffee"
Promise = require "q"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model "ConfigsAddModel",
  initialState: ->
    httpGet "#{window.location.pathname}__json/"
      .then (response) ->
        state =
          title: response.title
          alias: response.alias
          module: response.module
          fields: response.fields
          types: response.types
        if response.id
          state.id = response.id
        console.log state
        state

  addField: (field) ->
    @set fields: @state.fields.concat [field]

  addEmptyField: ->
    @set fields: @state.fields.concat [
      title: ""
      alias: ""
      type: "string"
    ]

  updateTitle: (value) -> @state.title = value
  updateAlias: (value) -> @state.alias = value
  updateModule: (value) -> @state.module = value

  updateFieldTitle: (index, value) -> @state.fields[index].title = value
  updateFieldAlias: (index, value) -> @state.fields[index].alias = value
  updateFieldType: (index, value) ->
    @state.fields[index].type = value
    @resetSettings index
    @set fields: @state.fields

  resetSettings: (index) ->
    type = @state.fields[index].type
    for typeItem in @state.types
      if typeItem.alias == type
        @state.fields[index].settings = @clone typeItem.defaultSettings

  removeField: (index) ->
    @state.fields.splice index, 1
    @set fields: @state.fields

  getFieldByIndex: (index) -> @clone @state.fields[index]

  saveFieldConfigs: (form) ->
    index = form.index
    delete form.index
    @state.fields[index].settings = form

  save: ->
    httpPost "/cms/configs/save/__json/", @state
      .then (response) =>
        if @state.id?
          @set fields: response.section.fields
          @set id: response.section.id
        else
          @trigger "onSavedSection", @state.alias
      .catch (response) ->
        console.error response.error
