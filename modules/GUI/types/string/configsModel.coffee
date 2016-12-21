Model = require "model.coffee"
configs = require "types/string/configs.json"

module.exports = Model
  getState: ->
    settings: @state.settings
    index: @state.index

  initial: ->
    copyValueOfSources = []

    for field, index in @state.fields
      if field.type == "string" && index != @state.index && field.alias
        copyValueOfSources.push alias: field.alias, label: field.title

    @set settings: {copyValueOfSources}

  defaultState: -> settings: configs.defaultSettings

  updateCopyValueOf: (copyValueOf) -> @set settings: {copyValueOf}

  updateCopyValueOfValue: (copyValueOfValue) -> @set settings: {copyValueOfValue}

  updateRemovePunctuation: (removePunctuation) -> @set settings: {removePunctuation}

  updateTranslit: (translit) -> @set settings: {translit}
