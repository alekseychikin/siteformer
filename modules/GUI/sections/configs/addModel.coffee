Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  initialState: ->
    httpGet window.location.pathname
      .then (response) ->
        state =
          title: response.title
          alias: response.alias
          module: response.module
          fields: response.fields
          types: response.types
          sections: response.sections
        state.id = response.id if response.id
        console.log state
        state

  addField: (field) ->
    @set fields: @state.fields.concat [field]

  addEmptyField: ->
    field = [
      title: ""
      alias: ""
      type: "string"
      position: @state.fields.length
      section: @state.id
    ]

    for typeItem in @state.types
      if typeItem.type == "string"
        field[0].settings = @clone typeItem.defaultSettings

    @set fields: @state.fields.concat field

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
      if typeItem.type == type
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

  updatePosition: (rowIndex, position) ->
    fields = @getFields()

    different = rowIndex - position

    if different
      fields.forEach (field, index) -> field.position += different if index >= position
      fields[rowIndex].position = position
      fields.sort (a, b) -> a.position - b.position
      fields.forEach (field, index) -> field.position = index

      @set {fields}

  save: ->
    data =
      alias: @state.alias
      title: @state.title
      module: @state.module
      fields: @state.fields

    data.id = @state.id if @state.id?

    console.log data

    httpPost "/cms/configs/action_save/", data
      .then (response) =>
        console.log response.content if response.content?
        if @state.id?
          # @set fields: response.section.fields
          @set id: response.section.id
        else
          @trigger "onSavedSection", @state.alias
      .catch (response) ->
        console.log response.content if response.content?
        console.error response.error if response.error?

  getSections: -> @state.sections
