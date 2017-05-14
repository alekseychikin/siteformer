{httpGet} = require "libs/ajax.coffee"

ProfileModel = require "./profileModel.coffee"
ProfileView = require "./profileView.coffee"

StringTypeModel = require "types/string/addModel.coffee"
ImageTypeModel = require "types/image/addModel.coffee"

StringTypeView = require "types/string/addView.coffee"
ImageTypeView = require "types/image/addView.coffee"

httpGet window.location.href
.then (response) =>
  profileModel = new ProfileModel response
  profileView = new ProfileView (document.querySelector "[data-role='profile-placeholder']"), profileModel

  profileModel.userpic = new ImageTypeModel
    data: response.user.userpic || ""
    alias: "userpic"
    settings:
      hide: false
    width: 120
    height: 130
  new ImageTypeView (document.querySelector "[data-role='userpic-placeholder']"), profileModel.userpic

  profileModel.email = new StringTypeModel
    data: response.user.email
    alias: "email"
    type: "email"

  profileModel.email.messages =
    EEMPTYREQUIREDVALUE: profileModel.email.messages.EEMPTYREQUIREDVALUE
    ENOTUNIQUEVALUE: "Такая почта закреплена за другим пользователем. Заведите другую."

  new StringTypeView (document.querySelector "[data-role='email-placeholder']"), profileModel.email

  profileModel.password = new StringTypeModel
    data: ""
    alias: "password"
    type: "password"

  new StringTypeView (document.querySelector "[data-role='password-placeholder']"), profileModel.password

  profileModel.on "profile-update", ->
    console.log "Profile is updated"
