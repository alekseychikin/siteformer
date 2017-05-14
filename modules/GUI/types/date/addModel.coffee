Model = require "libs/model.coffee"

module.exports = class DateDataModel extends Model
  constructor: (state = {}) -> super state

  updateDate: (value) -> @set date: value
  updateTime: (value) -> @set time: value

  get: ->
    date = @state.date
    date += " #{@state.time}" if @state.settings.useTime
    date
