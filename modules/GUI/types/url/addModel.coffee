Model = require "model.coffee"

module.exports = Model
  defaultState: ->
    data: ""
    error: ""

  update: (data) ->
    @set
      data: data
      error: ""

  showError: (message) -> @set error: message

  get: -> @state.data
