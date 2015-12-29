Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  initialState: ->
    httpGet "#{window.location.pathname}__json/"

  setCheck: (index, checked) ->
    index = parseInt index, 10
    sections = @state.sections.slice()
    sections[index].checked = checked
    @set sections: sections

  checkAll: (checked) ->
    sections = @state.sections.slice()
    for section in sections
      section.checked = checked
    @set sections: sections

  removeSubmit: ->
    sourceSections = @state.sections.slice()
    sections = []
    deleteSections = []
    for section in sourceSections
      if !section.checked? || !section.checked
        sections.push section
      else
        deleteSections.push section.id
    httpPost "#{window.location.pathname}action_delete/__json/", {deleteSections}
    .catch (response) =>
      console.error response.error
      @set sections: sourceSections
    @set sections: sections
