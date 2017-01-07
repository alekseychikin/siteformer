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
          modules: response.modules
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
      required: 0
    ]

    for typeItem in @state.types
      if typeItem.type == "string"
        field[0].settings = @clone typeItem.defaultSettings

    @set fields: @state.fields.concat field

  updateTitle: (value) ->
    @set
      title: value
      errorTitle: ""

  updateAlias: (value) ->
    @set
      alias: value
      errorAlias: ""

  updateModule: (value) -> @set module: value

  updateFieldTitle: (index, value) ->
    fields = @state.fields.slice()
    fields[index].title = value
    @set
      fields: fields
      errorFieldsField: ''
      errorFieldsMessage: ''
      errorFieldsIndex: false

  updateFieldAlias: (index, value) ->
    fields = @state.fields.slice()
    fields[index].alias = value
    @set
      fields: fields
      errorFieldsField: ''
      errorFieldsMessage: ''
      errorFieldsIndex: false

  updateFieldType: (index, value) ->
    fields = @state.fields.slice()
    fields[index].type = value
    @resetSettings index
    @set {fields}

  updateFieldRequired: (index, value) ->
    fields = @state.fields.slice()
    fields[index].required = value ? 1 : 0
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
    fields.forEach (field, index) -> field.position = index
    @set {fields}

  getFieldByIndex: (index) -> @clone @state.fields[index]

  getFields: -> @state.fields.slice()

  saveFieldSettings: (state) ->
    fields = @state.fields.slice()
    fields[state.index].settings = @extends {}, state.settings
    if @state.errorFieldsField? && @state.errorFieldsField == "settings"
      @set
        fields: fields
        errorFieldsField: ''
        errorFieldsMessage: ''
        errorFieldsIndex: false
    else
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
          @trigger "save-section", @state.alias
      .catch (response) =>
        @showError response.error.message if response.error? and response.error.message?

  showError: (error) ->
    switch error.index[0]
      when "title" then @set errorTitle: @getTitleErrorMessage error.code
      when "alias" then @set errorAlias: @getAliasErrorMessage error.code
      when "fields" then @showErrorFields error

  getTitleErrorMessage: (code) ->
    switch code
      when "EEMPTYREQUIRED" then "Поле обязательно к заполнению"
      when "ENOTUNIQUEVALUE" then "Раздел с таким именем уже есть, придумайте другое"
      else "Неизвестная ошибка: #{code}"

  getAliasErrorMessage: (code) ->
    switch code
      when "EEMPTYREQUIRED" then "Поле обязательно к заполнению"
      when "ENOTUNIQUEVALUE" then "Раздел с таким веб-именем уже есть, придумайте другое"
      when "ENOTVALIDVALUE" then "Веб-имя может состоять только из символов латинского алфавита, дефис и подчеркивания"
      else "Неизвестная ошибка: #{code}"

  showErrorFields: (error) ->
    @set
      errorFieldsIndex: error.index[1]
      errorFieldsField: error.index[2]
      errorFieldsMessage: @getFieldsErrorMessage error.index[2], error.code

    if error.index[2] == "settings"
      settingsErrorIndex = error.index.slice(0)
      settingsErrorIndex.splice 0, 3
      settingsErrorCode = error.code
      fields = @state.fields.slice(0)
      fields[error.index[1]].settings.errorIndex = settingsErrorIndex
      fields[error.index[1]].settings.errorCode = settingsErrorCode

  getFieldsErrorMessage: (field, code) ->
    switch field
      when "title" then @getTitleErrorMessage code
      when "alias" then @getAliasErrorMessage code
      when "settings" then "Задайте настройки"

  getSections: -> @state.sections

  remove: ->
    httpPost "/cms/configs/action_delete/", id: @state.id
      .then => @trigger "delete-section"
