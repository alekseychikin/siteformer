Model = require "model.coffee"

module.exports = Model "TypeRadioModel",

  getState: -> @state

  updateNumOptions: (value) ->
    value = parseInt value, 10
    defaultData = @state.defaultData
    if value > @state.numOptions
      for i in [@state.numOptions + 1..value]
        defaultData.push ""
    else
      for i in [value + 1..@state.numOptions]
        defaultData.pop()
      if @state.defaultValue >= value
        @set defaultValue: -1
    @state.numOptions = value
    @set defaultData: defaultData

  updateDefaultValue: (value) -> @state.defaultValue = parseInt value, 10

  updateDefaultDataOption: (index, value) -> @state.defaultData[index] = value
