Model = require "model.coffee"
configs = require "types/section/configs.json"

module.exports = class SectionConfigsModel extends Model
  constructor: (state = {}) ->
    super state

  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateSection: (section) ->
    @set
      settings:
        section: section
        errorIndex: []
        errorCode: ""

  updateField: (field) ->
    @set
      settings:
        field: field
        errorIndex: []
        errorCode: ""
