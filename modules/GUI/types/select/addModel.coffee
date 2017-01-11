Model = require "model.coffee"

module.exports = class SelectDataModel extends Model
  constructor: (state= {data: -1}) -> super state

  update: (data) -> @set {data}

  get: -> @state.data
