Model = require "model.coffee"
configs = require "types/select/configs.json"

module.exports = Model
  defaultState: -> configs.defaultSettings

  getState: -> @state

  updateNumOptions: (value) ->
    numOpts = @state.numOptions
    defaultValue = @state.defaultValue
    defaultData = @state.defaultData.slice()

    if !isNaN value
      if value > numOpts
        for i in [numOpts + 1..value]
          defaultData.push ""
      else if value < numOpts
        for i in [value + 1..numOpts]
          defaultData.pop()
        if defaultValue >= value
          @set {defaultValue}

      defaultValue = -1 if defaultValue + 1 >= value

      @set
        numOptions: value
        defaultData: defaultData
        defaultValue: defaultValue

  updateDefaultValue: (value) -> @set defaultValue: parseInt value, 10

  updateDefaultDataOption: (index, value) ->
    data = @state.defaultData.slice()
    data[index] = value
    @set defaultData: data
