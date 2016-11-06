Model = require "model.coffee"
configs = require "types/section/configs.json"

module.exports = Model
  defaultState: -> configs.defaultSettings

  getState: ->
    section: @state.section
    field: @state.field
    index: @state.index

  setSections: (sections) -> @set {sections}

  updateSection: (section) -> @set {section}

  updateField: (field) -> @set {field}
