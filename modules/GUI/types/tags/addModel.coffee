Model = require "model.coffee"
skipEmptyQuery = (require "helpers.coffee").skipEmptyQuery
skipLastQuery = (require "helpers.coffee").skipLastQuery
throttle = (require "helpers.coffee").throttle
httpGet = (require "ajax.coffee").httpGet

fetchData = (url, section, field) -> (query) -> httpGet url,
  src: query
  section: section
  field: field

setResults = (data) -> @set searchResult: data.result

module.exports = Model
  defaultState: ->
    data: ""
    start: 0
    end: 0
    searchResult: []

  update: (value) ->
    @getEditablePart value
      .then skipLastQuery @state.field.id
      .then skipEmptyQuery
      .then throttle 500
      .then fetchData "/cms/types/tags/search/", @state.field.section, @state.field.id
      .then setResults.bind @
      .catch @emptySearch.bind @

    @set data: value

  emptySearch: -> @set searchResult: []

  getEditablePart: (value) ->
    offset = 0

    tags = value
      .split ","
      .map (tag) ->
        start: offset
        end: (offset += tag.length + 1) - 1
        tag: tag

    [tag] = tags.filter (tag) => tag.start <= @state.start <= tag.end

    Promise.resolve tag && tag.tag.trim() || ""

  setSelection: (start, end) -> @set {start, end}

  setTag: (tag) ->
    offset = 0

    tags = @state.data
      .split ","
      .map (tag) ->
        start: offset
        end: (offset += tag.length + 1) - 1
        tag: tag

    tags.map (item) =>
      item.tag = item.tag.replace /^(\s*).*?(\s*)$/, "$1#{tag.title}$2" if item.start <= @state.start <= item.end
      item

    value = tags
      .map (item) => item.tag
      .join ","

    @set data: value
    @emptySearch()

  get: -> @state.data
