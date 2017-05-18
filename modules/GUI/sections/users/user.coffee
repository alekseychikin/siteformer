{httpGet} = require "libs/helpers.coffee"

UserModel = require "./userModel.coffee"
UserView = require "./userView.coffee"

SelectTypeModel = require "types/select/addModel.coffee"
StringTypeModel = require "types/string/addModel.coffee"

SelectTypeView = require "types/select/addView.coffee"
StringTypeView = require "types/string/addView.coffee"

httpGet window.location.href
.then (response) =>
  UserModel = new UserModel response
  UserView = new UserView (document.querySelector "[data-role='profile-placeholder']"), UserModel

  UserModel.login = response["edit-user"].login

  UserModel.email = new StringTypeModel
    data: response["edit-user"].email
    alias: "email"
    type: "email"

  UserModel.email.messages =
    EEMPTYREQUIREDVALUE: UserModel.email.messages.EEMPTYREQUIREDVALUE
    ENOTUNIQUEVALUE: "Такая почта закреплена за другим пользователем. Заведите другую."

  new StringTypeView (document.querySelector "[data-role='email-placeholder']"), UserModel.email

  UserModel.role = new SelectTypeModel
    data: response["edit-user"].role
    alias: "role"
    settings:
      defaultData:
        user: "Пользователь"
        admin: "Администратор"
      defaultValue: "user"

  new SelectTypeView (document.querySelector "[data-role='role-placeholder']"), UserModel.role

  UserModel.on "profile-update", ->
    console.log "Profile is updated"

  UserModel.on "profile-delete", ->
    window.location.href = "/cms/users/"
