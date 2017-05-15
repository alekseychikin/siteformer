Model = require 'libs/model.coffee'
{httpGet, httpPost} = require 'libs/helpers.coffee'

module.exports = class LoginModel extends Model
  constructor: (state = {}) ->
    super state

    httpGet window.location.href
    .then (response) => @replace response

  setLogin: (login) ->
    @set
      "login": login
      "is-selected-user": true

  updatePassword: (password) -> @set {password}


  submitForm: ->
    httpPost window.location.href,
      login: @state.login
      password: @state.password
      login_submit: true
    .then (response) ->
      window.location.reload()
    .catch (e) =>
      if e.error?.message?.code? && e.error.message.code == 'EWRONGAUTH'
        @set "error-login": true

  resetError: -> @set "error-login": false
