loginTemplate = require 'dist/components/login/login.tmplt'
render = require 'libs/render'
View = require 'libs/view.coffee'

module.exports = class LoginView extends View
  constructor: (target, model) ->
    super target, model

    @renderLogin = render loginTemplate, target
  events:
    "click: [data-role='login-user']": (e) ->
      @model.setLogin e.selectorTarget.getAttribute "data-login"
    "input change: [data-role='login-password']": (e) -> @model.updatePassword e.target.value
    "submit: [data-role='login-form']": (e) ->
      @model.submitForm()
      e.preventDefault()
    "animationend: [data-role='password-placeholder']": (e) -> @model.resetError()
  render: (state) -> @renderLogin state
