Model = require "model.coffee"
configs = require "types/section/configs.json"

module.exports = Model
  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  initial: ->
    section = ""
    field = ""

    @state.sections.forEach (item) -> section = item.alias if !section && item.alias
    @set settings: {section} if !@state.settings.section

    @state.sections.forEach (item) ->
      if section == item.alias
        item.fields.forEach (item) ->
          if !field && item.alias
            field = item.alias

    @set settings: {field} if !@state.settings.field

  updateSection: (section) -> @set settings: {section}

  updateField: (field) -> @set settings: {field}
