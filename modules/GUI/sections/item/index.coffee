IndexView = require "./indexView.coffee"
IndexModel = require "./indexModel.coffee"

UserFieldsPopupModel = require "./userFieldsPopupModel.coffee"
UserFieldsPopupView = require "./userFieldsPopupView.coffee"

indexModel = new IndexModel()

Popup = require "libs/popup"

itemListContainer = document.querySelector "[data-role='item-list']"
indexView = new IndexView itemListContainer, indexModel

configsPopupContainer = document.querySelector "[data-role='configs-popup']"

indexView.on "open-user-fields-popup", ->
  Popup.open "[data-role='configs-popup']"

  userFieldsPopupModel = new UserFieldsPopupModel
    "user-fields": indexModel.getUserFields()
    fields: indexModel.getFields()

  userFieldsPopupView = new UserFieldsPopupView configsPopupContainer, userFieldsPopupModel

  userFieldsPopupView.on "save-user-fields", (userFields) ->
    indexModel.updateUserFields userFields

    Popup.close()
    userFieldsPopupView.destroy()
