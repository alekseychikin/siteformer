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

module.exports = class SectionDataModel extends Model
  constructor: (target, model) ->
    super target, model

    @set
      data:
        id: ""
        searchResult: []
      searchSection: @state.field.settings.section
      searchField: @state.field.settings.field

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
