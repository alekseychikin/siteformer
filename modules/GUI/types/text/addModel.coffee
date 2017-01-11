Model = require "model.coffee"

module.exports = class TextDataModel extends Model
  constructor: (state = {data: ""}) -> super state

  update: (data) -> @set {data}

  get: -> @state.data
