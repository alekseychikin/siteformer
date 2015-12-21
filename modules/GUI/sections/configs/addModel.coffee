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

  updateTitle: (value) -> @set title: value
  updateAlias: (value) -> @set alias: value
  updateModule: (value) -> @set module: value

  updateFieldTitle: (index, value) ->
    fields = @state.fields.slice()
    fields[index].title = value
    @set {fields}

  updateFieldAlias: (index, value) ->
    fields = @state.fields.slice()
    fields[index].alias = value
    @set {fields}

  updateFieldType: (index, value) ->
    fields = @state.fields.slice()
    fields[index].type = value
    @resetSettings index
    @set {fields}

  resetSettings: (index) ->
    fields = @state.fields.slice()
    type = fields[index].type
    for typeItem in @state.types
      if typeItem.alias == type
        fields[index].settings = @clone typeItem.defaultSettings
    @set {fields}

  removeField: (index) ->
    fields = @state.fields.slice()
    fields.splice index, 1
    @set {fields}

  getFieldByIndex: (index) -> @clone @state.fields[index]

  getFields: -> @state.fields.slice()

  saveFieldConfigs: (form) ->
    index = form.index
    delete form.index
    fields = @state.fields.slice()
    fields[index].settings = form
    @set {fields}

  save: ->
    console.log @state
    httpPost "/cms/configs/action_save/__json/", @state
      .then (response) =>
        if @state.id?
          @set fields: response.section.fields
          @set id: response.section.id
        else
          @trigger "onSavedSection", @state.alias
      .catch (response) ->
        console.error response.error
