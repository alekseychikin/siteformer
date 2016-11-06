Model = require "model.coffee"
configs = require "types/string/configs.json"

module.exports = Model
  getState: ->
    copyValueOf: @state.copyValueOf
    copyValueOfValue: @state.copyValueOfValue
    removePunctuation: @state.removePunctuation
    translit: @state.translit
    index: @state.index

  setFields: (fields) ->
    copyValueOfSources = []

    for field, index in fields
      if field.type == "string" && index != @state.index && field.alias
        copyValueOfSources.push alias: field.alias, label: field.title

    @set {copyValueOfSources}

  defaultState: -> configs.defaultSettings

  updateCopyValueOf: (copyValueOf) -> @set {copyValueOf}

  updateCopyValueOfValue: (copyValueOfValue) -> @set {copyValueOfValue}

  updateRemovePunctuation: (removePunctuation) -> @set {removePunctuation}

  updateTranslit: (translit) -> @set {translit}
