Model = require "model.coffee"
configs = require "types/select/configs.json"

module.exports = class SelectConfigsModel extends Model
  constructor: (state = {}) ->
    super state

  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateNumOptions: (value) ->
    numOpts = @state.settings.numOptions

    if numOpts != value
      defaultValue = @state.settings.defaultValue
      defaultData = @state.settings.defaultData.slice()

      if !isNaN value
        if value > numOpts
          for i in [numOpts + 1..value]
            defaultData.push ""
        else if value < numOpts
          for i in [value + 1..numOpts]
            defaultData.pop()
          if defaultValue >= value
            @set settings: {defaultValue}

        defaultValue = -1 if defaultValue + 1 >= value

        @set
          settings:
            numOptions: value
            defaultData: defaultData
            defaultValue: defaultValue
            errorIndex: false
            errorCode: ""

  updateDefaultValue: (value) ->
    @set
      settings:
        defaultValue: parseInt value, 10
        errorIndex: false
        errorCode: ""

  updateDefaultDataOption: (index, value) ->
    data = @state.settings.defaultData.slice()
    data[index] = value
    @set
      settings:
        defaultData: data
        errorIndex: false
        errorCode: ""
