{httpGet, graph} = require "libs/helpers.coffee"

AddConfigsModel = require "./addModel.coffee"
AddConfigsView = require "./addView.coffee"
MenuItemsView = require "components/menu/menu-items-view.coffee"

configsContainer = document.querySelector "[data-role='configs-add']"

Models =
  checkbox: require "types/checkbox/configsModel.coffee"
  date: require "types/date/configsModel.coffee"
  file: require "types/file/configsModel.coffee"
  gallery: require "types/gallery/configsModel.coffee"
  image: require "types/image/configsModel.coffee"
  radio: require "types/radio/configsModel.coffee"
  table: require "types/table/configsModel.coffee"
  section: require "types/section/configsModel.coffee"
  select: require "types/select/configsModel.coffee"
  text: require "types/text/configsModel.coffee"
  url: require "types/url/configsModel.coffee"

Views =
  checkbox: require "types/checkbox/configsView.coffee"
  date: require "types/date/configsView.coffee"
  file: require "types/file/configsView.coffee"
  gallery: require "types/gallery/configsView.coffee"
  image: require "types/image/configsView.coffee"
  radio: require "types/radio/configsView.coffee"
  table: require "types/table/configsView.coffee"
  section: require "types/section/configsView.coffee"
  select: require "types/select/configsView.coffee"
  text: require "types/text/configsView.coffee"
  url: require "types/url/configsView.coffee"

Popup = require "libs/popup"

httpGet window.location.href
.then (state) ->
  addModel = new AddConfigsModel state
  addView = new AddConfigsView configsContainer, addModel

  menuItemsView = new MenuItemsView (document.querySelector "[data-role='sections-menu']"), addModel

  addView.on "open-configs-modal", (index, field, fields = []) ->
    Popup.open "[data-role='configs-popup']"

    sections = addModel.getSections().filter (section) -> section.id != field.section

    model = new Models[field.type]
      index: index
      field: field
      settings: field.settings
      fields: fields
      sections: sections

    popupContainer = document.querySelector "[data-role='configs-popup']"
    popupContainer.innerHTML = ""
    view = new Views[field.type] popupContainer, model

    view.on "save-configs-modal", (state) ->
      console.log state
      addModel.saveFieldSettings state
      Popup.close()
      view.destroy()

  addModel.on "save-section", (state) ->
    graph.post
      "gui-sections": state
    .get
      sections: "gui-sections"
    .send()
    .then (response) =>
      addModel.set sections: response.sections
    .catch (response) =>
      addModel.showError response.error.message if response.error? and response.error.message?

  addModel.on "create-section", (state) ->
    graph.post
      "gui-sections": state
    .get
      sections: "gui-sections"
    .send()
    .then (response) =>
      window.location.href = "/cms/configs/#{state.alias}/"
    .catch (response) =>
      addModel.showError response.error.message if response.error? and response.error.message?

  addModel.on "delete-section", ->
    window.location.href = "/cms/configs/"
