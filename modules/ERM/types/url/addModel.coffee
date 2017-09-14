Model = require "libs/model.coffee"

module.exports = class UrlDataModel extends Model
  constructor: (state = {}) ->
    defaultData =
      data: ""
      error: ""

    super Object.assign defaultData, state

  update: (data) ->
    @set
      data: data
      error: ""

  showError: (message) -> @set error: message

  get: -> @state.data
