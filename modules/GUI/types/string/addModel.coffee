Model = require "libs/model.coffee"

module.exports = class StringConfigsModel extends Model
  constructor: (state = {}) ->
    defaultData =
      data: ""
      error: ""

    super Object.assign defaultData, state

  messages:
    EEMPTYREQUIREDVALUE: 'Обязательное к заполнению поле'

  update: (data) ->
    @set
      data: data
      error: ""

  showError: (code) -> @set error: @getMessage code

  hideError: -> @set error: ""

  getMessage: (code) -> @messages[code] or 'Непонятная ошибка'

  get: -> @state.data
