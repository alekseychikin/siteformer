Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/ajax.coffee"

module.exports = class ItemAddModel extends Model
  constructor: (state = {status: "draft"}) ->
    super state

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

    Promise.all promises
    .then =>
      httpPost "/index.php?graph", "gui-record": JSON.stringify
        section: @state.section
        id: @state.id
        data: result
        status: @state.status
    .then (response) =>
      @trigger "create-record", @state.section, response['gui-record'] if !@state.id
    .catch (response) =>
      console.log response.error
      if response.error.message && response.error.message.index
        error = response.error.message
        console.log error

        @showError error.index, error.code

  showError: (index, code) ->
    for field in @state.fields
      field.model.showError code if field.name == index[0] && field.model.showError?

  delete: ->
    data =
      id: @state.id
      section: @state.section

    httpPost "/index.php?graph", 'gui-record': JSON.stringify
      section: @state.section
      delete: @state.id
    .then => @trigger "delete-record", @state.section
