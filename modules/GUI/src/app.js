import { createStore } from './store'
import renderino from './libs/renderino'
import configsAddTemplate from './templates/pages/configs-add.gutt'

import { handleActions, connect } from './libs/dispatch'
import registerComponent from './libs/components'

const loadComponents = import('./components')

const configsAdd = import('./templates/pages/configs-add.js')

const appNode = document.getElementById('app')

const renderPage = renderino(configsAddTemplate, appNode)

function setStateHandler(store) {
	renderPage(store.getState())
}

const initialPage = async function () {
	const store = await createStore(setStateHandler)
	const ConfigsAdd = (await configsAdd).default
	const components = (await loadComponents).default

	registerComponent([
		connect(ConfigsAdd, store)
	])

	registerComponent(components)
}

initialPage()
