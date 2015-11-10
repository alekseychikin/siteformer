Model = require "model.coffee"

module.exports = Model "TypeImageModel",
  changePath: (path) -> @state.path = path

  changeSizeWidth: (width) -> @state.width = width
  changeSizeHeight: (height) -> @state.height = height

  changeSource: (source) -> @state.source = source

  updatePath: (value) -> @state.path = value

  updateWidth: (value) -> @state.width = value
  updateHeight: (value) -> @state.height = value

  updateSource: (value) -> @state.source = value

  getState: -> @state
