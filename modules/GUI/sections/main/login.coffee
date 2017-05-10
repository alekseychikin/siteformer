LoginModel = require './loginModel.coffee'
LoginView = require './loginView.coffee'

loginModel = new LoginModel()
loginView = new LoginView document.querySelector('[data-role="login-form"]'), loginModel
