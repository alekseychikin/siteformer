IndexModel = require "./indexModel.coffee"
indexModel = IndexModel()
IndexView = require "./indexView.coffee"
SectionsMenuView = require "./sectionsMenuView.coffee"

IndexView ($ "@sections"), indexModel
SectionsMenuView ($ "@sections-menu"), indexModel
