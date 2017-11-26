View = require "libs/view.coffee"
render = require "libs/render"
usersListTemplate = require "dist/sections/users/users-list.gutt"

module.exports = class UsersView extends View
  constructor: (target, model) ->
    super target, model

    @renderList = render usersListTemplate, target

  render: (state) -> @renderList state

  events:
    "input change: [data-role='email']": (e) -> @model.updateEmail e.target.value
    "click: [data-role='send-invitation']": (e) -> @model.sendInvitation()
    "click: [data-role='delete-invitation']": (e) -> @model.deleteInvitation e.target.getAttribute "data-email"
