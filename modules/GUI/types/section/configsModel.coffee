Model = require "model.coffee"

module.exports = Model
  getState: ->
    section: @state.section
    field: @state.field
    index: @state.index

  setSections: (sections) -> @set {sections}

  defaultState: ->
    section: false
    field: false

  updateSection: (section) -> @set {section}

  updateField: (field) -> @set {field}
