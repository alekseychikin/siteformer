Model = require "model.coffee"

module.exports = Model "TypeRadioModel",

  getState: -> @state

  updateNumOptions: (value) ->
    value = parseInt value, 10
    numOpts = parseInt @state.numOptions, 10
    defaultValue = parseInt @state.defaultValue, 10
    defaultData = @state.defaultData.slice()
    if value > numOpts
      for i in [numOpts + 1..value]
        defaultData.push ""
    else
      for i in [value + 1..numOpts]
        defaultData.pop()
      if defaultValue >= value
        @set {defaultValue}
    @set numOptions: value
    @set {defaultData}

  updateDefaultValue: (value) -> @set defaultValue: parseInt value, 10

  updateDefaultDataOption: (index, value) ->
    data = @state.defaultData.slice()
    data[index] = value
    @set defaultData: data
