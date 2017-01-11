$ = require "jquery-plugins.coffee"
IndexView = require "./indexView.coffee"
IndexModel = require "./indexModel.coffee"

UserFieldsPopupModel = require "./userFieldsPopupModel.coffee"
UserFieldsPopupView = require "./userFieldsPopupView.coffee"

indexModel = new IndexModel()

Popup = require "popup"

indexView = new IndexView ($ "[data-role='item-list']"), indexModel

configsPopupSelector = "[data-role='configs-popup']"

indexView.on "open-user-fields-popup", ->
  Popup.open configsPopupSelector

  ($ configsPopupSelector).html ""

  userFieldsPopupModel = new UserFieldsPopupModel
    userFields: indexModel.getUserFields()
    fields: indexModel.getFields()

  userFieldsPopupView = new UserFieldsPopupView ($ configsPopupSelector), userFieldsPopupModel

  userFieldsPopupView.on "save-user-fields", (userFields) ->
    indexModel.updateUserFields userFields

    Popup.close()
    userFieldsPopupView.destroy()
