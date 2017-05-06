Model = require "libs/model.coffee"
{httpGet} = require "libs/ajax.coffee"
{skipEmptyQuery, skipLastQuery, throttle} = require "libs/helpers.coffee"

fetchData = (url, section, field) -> (query) -> httpGet url,
  src: query
  section: section
  field: field

setResults = (data) ->
  @set searchResult: data.result

module.exports = class SectionDataModel extends Model
  constructor: (state = {}) ->
    super state

    @set
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
