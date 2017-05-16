Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/helpers.coffee"

module.exports = class ItemAddModel extends Model
  constructor: (state = {status: "draft"}) ->
    super state

  addField: (name, model) ->
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
    data = {}
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
                data[itemName] = value
              .catch (error) ->
                console.error error
          else
            data[itemName] = value
      catch e
        console.error e

    Promise.all promises
    .then =>
      if @state.id?
        @trigger "save-record", @state, data
      else
        @trigger "create-record", @state, data

  showError: (index, code) ->
    for field in @state.fields
      field.model.showError code if field.name == index[0] && field.model.showError?

  delete: -> @trigger "delete-record", @state.section, @state.id
