UsersModel = require "./usersModel.coffee"
UsersView = require "./usersView.coffee"

{httpGet, graph} = require "libs/helpers.coffee"

httpGet window.location.href
.then (response) ->
  usersModel = new UsersModel response
  usersView = new UsersView (document.querySelector "[data-role='users']"), usersModel

  usersModel.on "send-invitation", (email) ->
    graph.get
      invitations: "gui-users?invitations"
      users: "gui-users"
    .post
      "gui-users": {email, "send-invitation": true}
    .send()
    .then (response) ->
      usersModel.resetForm()
      usersModel.set response
    .catch (response) ->
      if response.error?.message?
        usersModel.setError response.error.message

  usersModel.on "delete-invitation", (email) ->
    graph.get
      invitations: "gui-users?invitations"
      users: "gui-users"
    .post
      "gui-users": {email, "delete-invitation": true}
    .send()
    .then (response) ->
      usersModel.set response
    .catch (response) ->
      console.error response
