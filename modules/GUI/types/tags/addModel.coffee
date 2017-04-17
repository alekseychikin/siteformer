Model = require "libs/model.coffee"
{skipEmptyQuery, skipLastQuery, throttle} = require "libs/helpers.coffee"
{httpGet} = require "libs/ajax.coffee"

fetchData = (url, section, field) -> (query) -> httpGet url,
  src: query
  section: section
  field: field

setResults = (data) -> @set searchResult: data.result

module.exports = class TagsDataModel extends Model
  constructor: (state = {}) ->
    defaultData =
      data: ""
      start: 0
      end: 0
      searchResult: []

    super Object.assign defaultData, state

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
      if item.start <= @state.start <= item.end
        item.tag = item.tag.replace /^(\s*).*?(\s*)$/, "$1#{tag.title}$2"

      item

    value = tags
      .map (item) -> item.tag
      .join ","

    @set data: value
    @emptySearch()

  get: -> @state.data
