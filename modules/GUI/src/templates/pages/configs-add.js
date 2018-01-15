import Component from '../../libs/component'
import { createAction } from '../../libs/dispatch'

import { emitEvent } from '../../libs/helpers'

const ConfigsComponents = {
	checkbox: import('../../components/configs-checkbox/configs-checkbox.js'),
	collection: import('../../components/configs-collection/configs-collection.js'),
	date: import('../../components/configs-date/configs-date.js'),
	file: import('../../components/configs-file/configs-file.js'),
	gallery: import('../../components/configs-gallery/configs-gallery.js'),
	image: import('../../components/configs-image/configs-image.js'),
	radio: import('../../components/configs-radio/configs-radio.js'),
	select: import('../../components/configs-select/configs-select.js'),
	table: import('../../components/configs-table/configs-table.js'),
	text: import('../../components/configs-text/configs-text.js'),
	url: import('../../components/configs-url/configs-url.js')
}

const cacheModules = {}

export default class ConfigsAdd extends Component {
	static get selector() {
		return '#app'
	}

	get events() {
		return {
			'input change: [data-role="configs-add-title"]': this.changeTitleHandler,
			'input change: [data-role="configs-add-alias"]': this.changeAliasHandler,
			'input change: [data-role="field-title"]': this.changeFieldTitleHandler,
			'input change: [data-role="field-alias"]': this.changeFieldAliasHandler,
			'change: [data-role="configs-change-type"]': this.changeTypeHandler,
			'click: [data-role="btn-add-field"]': this.clickAddFieldHandler,
			'click: [data-role="btn-remove-field"]': this.clickRemoveFieldHandler,
			'click: [data-role="btn-config-field"]': this.clickOpenSettingsHandler,
			'submit: [data-role="configs-add-form"]': this.submitConfigsForm
		}
	}

	constructor(node, store) {
		super(node)

		this.store = store

		this.rowSelector = '[data-role="row-module-fields"]'

		this.openedConfigs = null
		this.indexFieldConfigsModalOpen = false
	}

	changeTitleHandler(event) {
		createAction('CONFIGS_UPDATE_TITLE', { title: event.target.value })
	}

	changeAliasHandler(event) {
		createAction('CONFIGS_UPDATE_ALIAS', { alias: event.target.value })
	}

	changeFieldTitleHandler(event) {
		const container = event.target.closest('[data-role="row-module-fields"]')
		const index = Number(container.dataset.index)
		const title = event.target.value

		createAction('FIELDS_CHANGE_TITLE', { index, title })
	}

	changeFieldAliasHandler(event) {
		const container = event.target.closest('[data-role="row-module-fields"]')
		const index = Number(container.dataset.index)
		const alias = event.target.value

		createAction('FIELDS_CHANGE_ALIAS', { index, alias })
	}

	async clickOpenSettingsHandler(event) {
		const row = event.target.closest(this.rowSelector)
		const index = Number(row.dataset.index)
		const state = this.store.getState()
		const [ field ] = state.fields.filter((item, idx) => idx === index)
		const [ type ] = state.types.filter(item => item.type === field.type)

		this.indexFieldConfigsModalOpen = index

		let module = cacheModules[field.type]

		if (!module) {
			module = await ConfigsComponents[field.type]
			cacheModules[field.type] = module
		}

		const error = state.error && {
			code: state.error.code,
			index: state.error.index.slice(3),
			source: state.error.source
		}

		const ConfigComponent = module.default

		this.openedConfigs = new ConfigComponent({
			error,
			...field.settings
		}, {
			onSubmit: this.submitSettingsFormHandler.bind(this),
			onClose: this.cancelSettingsFormHandler.bind(this)
		}, {
			fields: state.fields,
			types: state.types,
			storages: state.storages,
			collections: state.collections,
			currentField: field
		})

		createAction('CONFIGS_CLEAR_ERROR')
		this.openedConfigs.open()
	}

	submitSettingsFormHandler(configsModalState) {
		createAction('FIELDS_CHANGE_SETTINGS', {
			index: this.indexFieldConfigsModalOpen,
			settings: configsModalState
		})

		this.openedConfigs.close()
	}

	cancelSettingsFormHandler() {
		this.openedConfigs.destroy()
	}

	clickAddFieldHandler() {
		createAction('FIELDS_ADD_EMPTY')
	}

	clickRemoveFieldHandler(event) {
		const row = event.target.closest(this.rowSelector)
		const index = Number(row.dataset.index)

		createAction('REMOVE_FIELD_BY_INDEX', { index })
	}

	changeTypeHandler(event) {
		const row = event.target.closest(this.rowSelector)
		const type = event.target.value
		const index = row.dataset.index

		createAction('FIELDS_CHANGE_TYPE', { type, index })
	}

	submitConfigsForm(event) {
		createAction('CONFIGS_SAVE_FORM')

		event.preventDefault()
		return false
	}
}
