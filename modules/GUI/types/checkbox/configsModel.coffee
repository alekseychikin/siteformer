Model = require "model.coffee"
configs = require "types/checkbox/configs.json"

module.exports = Model
  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateNumOptions: (value) ->
    value = parseInt value, 10
    numOpts = parseInt @state.settings.numOptions, 10

    if numOpts != value
      defaultData = @state.settings.defaultData.slice()

      if !isNaN value
        if value > numOpts
          for i in [numOpts + 1..value]
            defaultData.push
              label: ""
              checked: false
        else if value < numOpts
          for i in [value + 1..numOpts]
            defaultData.pop()

        @set
          settings:
            numOptions: value
            defaultData: defaultData
            errorIndex: false
            errorCode: ""

  updateDefaultDataOptionChecked: (index, value) ->
    data = @state.settings.defaultData.slice()
    data[index].checked = value
    @set
      settings:
        defaultData: data
        errorIndex: false
        errorCode: ""

  updateDefaultDataOption: (index, value) ->
    data = @state.settings.defaultData.slice()
    data[index].label = value
    @set
      settings:
        defaultData: data
        errorIndex: false
        errorCode: ""
