Model = require "model.coffee"

module.exports = Model
  defaultState: ->
    data: ""
    error: ""

  messages:
    EEMPTYREQUIREDVALUE: 'Обязательное к заполнению поле'

  update: (data) ->
    @set
      data: data
      error: ""

  showError: (code) -> @set error: @getMessage code

  getMessage: (code) -> @messages[code] or 'Непонятная ошибка'

  get: -> @state.data
