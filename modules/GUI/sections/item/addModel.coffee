Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  initialState: ->
    status: "draft"

  add: (name, model) ->
    fields = @state.fields.slice()
    fields.push
      model: model
      name: name
    @set {fields}

  savePublic: ->
    @set status: "public"

    @save()

  saveDraft: ->
    @set status: "draft"

    @save()

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

    result.section = @state.section if @state.section?
    result.id = @state.id if @state.id?
    result.status = @state.status

    Promise.all promises
      .then =>
        console.log result
        httpPost "/cms/#{@state.section}/action_save/", data: result
      .then (response) ->
        console.log response
      .catch (error) ->
        console.error error.error

  delete: ->
    data =
      id: @state.id
      section: @state.section

    httpPost "/cms/#{@state.section}/action_delete/", data
      .then => @trigger "delete-section", @state.section
