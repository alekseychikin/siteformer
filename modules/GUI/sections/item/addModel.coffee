Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet

module.exports = Model
  initialState: ->
    fields: []

  add: (name, model) ->
    fields = @state.fields.slice()
    fields.push
      model: model
      name: name
    @set {fields}

  getFields: ->
    result = {}
    @state.fields.map (item) ->
      try
        if typeof item.model.get != "function"
          throw "#{item.name} has no `get` method"
        result[item.name] = item.model.get()
      catch e
        console.error e
    result
