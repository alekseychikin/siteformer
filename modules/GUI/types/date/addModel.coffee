Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    @set useTime: settings.useTime

  updateDate: (value) -> @set date: value
  updateTime: (value) -> @set time: value

  get: ->
    date = @state.date
    date += " #{@state.time}" if @state.field.settings.useTime
    date
