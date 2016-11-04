Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
skipEmptyQuery = (require "helpers.coffee").skipEmptyQuery
skipLastQuery = (require "helpers.coffee").skipLastQuery
throttle = (require "helpers.coffee").throttle

fetchData = (url, section, field) -> (query) -> httpGet url,
  src: query
  section: section
  field: field

setResults = (data) -> @set searchResult: data.result

module.exports = Model
  defaultState: ->
    data:
      id: ""
      searchResult: []
    searchSection: ""
    searchField: ""

  initial: () ->
    @set
      searchField: @state.field.settings.field
      searchSection: @state.field.settings.section

  selectResult: (id, title) ->
    data =
      id: id
      title: title

    @set {data}
    console.log data
    @emptySearch()

  emptySearch: -> @set searchResult: []

  emptyValue: ->
    data =
      id: ""
      title: ""

    @set {data}
    @emptySearch()

  search: (value) ->
    Promise.resolve value
      .then skipLastQuery "#{@state.field.section}_#{@state.field.id}"
      .then skipEmptyQuery
      .then throttle 500
      .then fetchData "/cms/types/section/search/", @state.searchSection, @state.searchField
      .then setResults.bind @
      .catch @emptySearch.bind @

  get: -> @state.data.id
