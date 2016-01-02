Model = require "model.coffee"

module.exports = Model
  setPreview: (input) -> @set filename: input.files[0].name

  removePreview: -> @set filename: false
