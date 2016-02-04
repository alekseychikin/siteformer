Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost
Promise = require "promise"

module.exports = Model
  add: (name, model) ->
    fields = @state.fields.slice()
    fields.push
      model: model
      name: name
    @set {fields}

  save: ->
    result = {}
    promises = []
    @state.fields.map (item) ->
      itemName = item.name
      try
        if typeof item.model.get != "function"
          throw "#{itemName} has no `get` method"
        value = item.model.get()
        promises.push value
        do (itemName, value) ->
          if value instanceof Promise
            value
            .then (value) ->
              result[itemName] = value
            .catch (error) ->
              console.error error
          else
            result[itemName] = value
      catch e
        console.error e

    Promise.all promises
    .then =>
      console.log result
      httpPost "/cms/#{@state.section}/action_save/__json/", data: result
    .then (response) ->
      console.log response
    .catch (error) ->
      console.error error.error