{httpGet} = require "libs/ajax.coffee"

UsersModel = require "./usersModel.coffee"
UsersView = require "./usersView.coffee"

StringTypeModel = require "types/string/addModel.coffee"
ImageTypeModel = require "types/image/addModel.coffee"

StringTypeView = require "types/string/addView.coffee"
ImageTypeView = require "types/image/addView.coffee"

httpGet window.location.href
.then (response) =>
  usersModel = new UsersModel response
  usersView = new UsersView (document.querySelector "[data-role='profile-placeholder']"), usersModel

  usersModel.userpic = new ImageTypeModel
    data: response.user.userpic || ""
    field:
      alias: "userpic"
      settings:
        hide: false
    width: 120
    height: 130
  new ImageTypeView (document.querySelector "[data-role='userpic-placeholder']"), usersModel.userpic

  usersModel.email = new StringTypeModel
    data: response.user.email
    field:
      alias: "email"
    type: "email"

  usersModel.email.messages =
    EEMPTYREQUIREDVALUE: usersModel.email.messages.EEMPTYREQUIREDVALUE
    ENOTUNIQUEVALUE: "Такая почта закреплена за другим пользователем. Заведите другую."

  new StringTypeView (document.querySelector "[data-role='email-placeholder']"), usersModel.email

  usersModel.password = new StringTypeModel
    data: ""
    field:
      alias: "password"
    type: "password"

  new StringTypeView (document.querySelector "[data-role='password-placeholder']"), usersModel.password

  usersModel.on "profile-update", ->
    console.log "Profile is updated"
