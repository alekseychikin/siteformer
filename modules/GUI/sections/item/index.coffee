{httpGet, graph} = require "libs/helpers.coffee"

IndexView = require "./indexView.coffee"
IndexModel = require "./indexModel.coffee"

UserFieldsPopupModel = require "./userFieldsPopupModel.coffee"
UserFieldsPopupView = require "./userFieldsPopupView.coffee"

popup = require "libs/popup"

itemListContainer = document.querySelector "[data-role='item-list']"
configsPopupContainer = document.querySelector "[data-role='configs-popup']"

httpGet window.location.href
.then (state) ->
  indexModel = new IndexModel state
  indexView = new IndexView itemListContainer, indexModel

  indexView.on "open-user-fields-popup", ->
    popup.open "[data-role='configs-popup']"

    userFieldsPopupModel = new UserFieldsPopupModel
      "user-fields": indexModel.getUserFields()
      fields: indexModel.getFields()

    userFieldsPopupView = new UserFieldsPopupView configsPopupContainer, userFieldsPopupModel

    userFieldsPopupView.on "save-user-fields", (userFields) ->
      indexModel.updateUserFields userFields

      popup.close()
      userFieldsPopupView.destroy()

  indexModel.on "save-user-fields", (section, userFields) ->
    graph.post
      "gui-fields":
        usersonly: true
        section: section
        fields:  userFields
    .send()
    .then ->
      indexModel.set "user-fields": userFields
