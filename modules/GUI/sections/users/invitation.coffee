{httpGet, graph} = require "libs/helpers.coffee"

InvitationModel = require "./invitationModel.coffee"
InvitationView = require "./invitationView.coffee"

StringTypeModel = require "types/string/addModel.coffee"
ImageTypeModel = require "types/image/addModel.coffee"

StringTypeView = require "types/string/addView.coffee"
ImageTypeView = require "types/image/addView.coffee"

httpGet window.location.href
.then (state) ->
  invitationModel = new InvitationModel()
  invitationView = new InvitationView (document.querySelector "[data-role='invitation']"), invitationModel

  invitationModel.userpic = new ImageTypeModel
    data: ""
    alias: "userpic"
    settings:
      hide: false
    width: 120
    height: 130
  new ImageTypeView (document.querySelector "[data-role='userpic-placeholder']"), invitationModel.userpic

  invitationModel.login = new StringTypeModel
    data: ""
    alias: "login"

  invitationModel.login.messages =
    EEMPTYREQUIRED: "Обязательно заполните логин"
    ENOTUNIQUEVALUE: "Пользователь с таким логином уже есть, придумайте другой"

  new StringTypeView (document.querySelector "[data-role='login-placeholder']"), invitationModel.login

  invitationModel.password = new StringTypeModel
    data: ""
    alias: "password"
    type: "password"

  invitationModel.password.messages =
    EEMPTYREQUIRED: "Обязательно заполните логин"
    ENOTUNIQUEVALUE: "Пользователь с таким логином уже есть, придумайте другой"

  new StringTypeView (document.querySelector "[data-role='password-placeholder']"), invitationModel.password

  invitationModel.on "create-account", ->
    promises = []
    result =
      login: invitationModel.login.get()
      password: invitationModel.password.get()
      hash: state.hash
      "create-account": true

    Promise.resolve invitationModel.userpic.get()
    .then (userpicPath) =>
      result.userpic = userpicPath
    .then =>
      graph.post
        "gui-profile": result
      .send()
    .then =>
      window.location.reload()
    .catch (response) =>
      if response.error?.message?.code? && response.error.message.index[0] == "login"
        invitationModel.login.showError response.error.message.code
      if response.error?.message?.code? && response.error.message.index[0] == "password"
        invitationModel.password.showError response.error.message.code
