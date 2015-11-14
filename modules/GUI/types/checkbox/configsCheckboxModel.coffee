Model = require "model.coffee"

module.exports = Model "TypeCheckboxModel",

  getState: -> @state

  updateNumOptions: (value) ->
    value = parseInt value, 10
    defaultData = @state.defaultData
    if value > @state.numOptions
      for i in [@state.numOptions + 1..value]
        defaultData.push
          label: ""
          checked: false
    else
      for i in [value + 1..@state.numOptions]
        defaultData.pop()
    @state.numOptions = value
    @set defaultData: defaultData

  updateDefaultDataOptionChecked: (index, value) -> @state.defaultData[index].checked = value
  updateDefaultDataOption: (index, value) -> @state.defaultData[index].label = value
