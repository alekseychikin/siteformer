Model = require "model.coffee"

module.exports = Model
  getState: -> @state

  updateNumOptions: (value) ->
    value = parseInt value, 10
    numOpts = parseInt @state.numOptions, 10
    defaultData = @state.defaultData.slice()
    if value > numOpts
      for i in [numOpts + 1..value]
        defaultData.push
          label: ""
          checked: false
    else
      for i in [value + 1..numOpts]
        defaultData.pop()
    @set numOptions: value
    @set defaultData: defaultData

  updateDefaultDataOptionChecked: (index, value) ->
    data = @state.defaultData.slice()
    data[index].checked = value
    @set defaultData: data

  updateDefaultDataOption: (index, value) ->
    data = @state.defaultData.slice()
    data[index].label = value
    @set defaultData: data
