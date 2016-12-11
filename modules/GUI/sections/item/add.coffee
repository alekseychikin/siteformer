$ = require "jquery-plugins.coffee"
httpGet = (require "ajax.coffee").httpGet

AddModel = require "./addModel.coffee"

AddView = require "./addView.coffee"

models =
  checkbox: require "checkbox/addModel.coffee"
  date: require "date/addModel.coffee"
  image: require "image/addModel.coffee"
  password: require "password/addModel.coffee"
  radio: require "radio/addModel.coffee"
  section: require "section/addModel.coffee"
  select: require "select/addModel.coffee"
  string: require "string/addModel.coffee"
  table: require "table/addModel.coffee"
  tags: require "tags/addModel.coffee"
  text: require "text/addModel.coffee"

views =
  checkbox: require "checkbox/addView.coffee"
  date: require "date/addView.coffee"
  image: require "image/addView.coffee"
  password: require "password/addView.coffee"
  radio: require "radio/addView.coffee"
  section: require "section/addView.coffee"
  select: require "select/addView.coffee"
  string: require "string/addView.coffee"
  table: require "table/addView.coffee"
  tags: require "tags/addView.coffee"
  text: require "text/addView.coffee"

httpGet window.location.href
  .then (response) ->
    addModel = AddModel
      section: response.section
      fields: []
      id: response.data.id
    addView = AddView ($ "@item-add-form"), addModel
    $rows = $ "[data-placeholder]"
    index = 0

    for field in response.fields
      do ->
        if models[field.type]?
          model = models[field.type] {field, data: response.data[field.alias]}
          addModel.add field.alias, model

          if views[field.type]? && (!field.settings.hide? || (field.settings.hide? && !field.settings.hide))
            views[field.type] $rows.eq(index), model

            index++
