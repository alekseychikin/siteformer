$ = require "jquery-plugins.coffee"
IndexView = require "./indexView.coffee"
IndexModel = require "./indexModel.coffee"

UserFieldsPopupModel = require "./userFieldsPopupModel.coffee"
UserFieldsPopupView = require "./userFieldsPopupView.coffee"

indexModel = new IndexModel()

Popup = require "popup"

configsPopupSelector = "[data-role='item-list']"
itemListContainer = document.querySelector configsPopupSelector
indexView = new IndexView itemListContainer, indexModel

configsPopupContainer = document.querySelector "[data-role='configs-popup']"

indexView.on "open-user-fields-popup", ->
  Popup.open configsPopupSelector

  # configsPopupContainer.innerHTML = ""

  userFieldsPopupModel = new UserFieldsPopupModel
    "user-fields": indexModel.getUserFields()
    fields: indexModel.getFields()

  userFieldsPopupView = new UserFieldsPopupView configsPopupContainer, userFieldsPopupModel

  userFieldsPopupView.on "save-user-fields", (userFields) ->
    indexModel.updateUserFields userFields

    Popup.close()
    userFieldsPopupView.destroy()
