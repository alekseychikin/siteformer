{httpGet} = require "libs/helpers.coffee"

AddModel = require "./addModel.coffee"

AddView = require "./addView.coffee"

Models =
  checkbox: require "types/checkbox/addModel.coffee"
  date: require "types/date/addModel.coffee"
  image: require "types/image/addModel.coffee"
  password: require "types/password/addModel.coffee"
  radio: require "types/radio/addModel.coffee"
  section: require "types/section/addModel.coffee"
  select: require "types/select/addModel.coffee"
  string: require "types/string/addModel.coffee"
  table: require "types/table/addModel.coffee"
  tags: require "types/tags/addModel.coffee"
  text: require "types/text/addModel.coffee"
  url: require "types/url/addModel.coffee"

Views =
  checkbox: require "types/checkbox/addView.coffee"
  date: require "types/date/addView.coffee"
  image: require "types/image/addView.coffee"
  password: require "types/password/addView.coffee"
  radio: require "types/radio/addView.coffee"
  section: require "types/section/addView.coffee"
  select: require "types/select/addView.coffee"
  string: require "types/string/addView.coffee"
  table: require "types/table/addView.coffee"
  tags: require "types/tags/addView.coffee"
  text: require "types/text/addView.coffee"
  url: require "types/url/addView.coffee"

httpGet window.location.href
  .then (response) ->
    addModel = new AddModel
      section: response.section
      fields: []
      id: response.data.id
    addFormContainer = document.querySelector "[data-role='item-add-form']"
    addView = new AddView addFormContainer, addModel
    rows = addFormContainer.querySelectorAll "[data-placeholder]"
    index = 0

    for field in response.fields
      do ->
        if Models[field.type]?
          model = new Models[field.type]
            settings: field.settings
            alias: field.alias
            data: response.data[field.alias]
            section: field.section

          addModel.add field.alias, model

          if Views[field.type]? && (!field.settings.hide? || (field.settings.hide? && !field.settings.hide))
            new Views[field.type] rows[index], model

            index++

    addModel.on "delete-record", (section) ->
      window.location.href = "/cms/#{section}"

    addModel.on "create-record", (section, id) ->
      window.location.href = "/cms/#{section}/#{id}/"
