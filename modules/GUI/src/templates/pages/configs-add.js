import Component from '../../libs/component'
import {createAction} from '../../libs/dispatch'

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
			'input change: [data-role="field-title"]': this.changeFieldTitleHandler,
			'input change: [data-role="field-alias"]': this.changeFieldAliasHandler,
			'click: [data-role="btn-add-field"]': this.clickAddFieldHandler,
			'click: [data-role="btn-remove-field"]': this.clickRemoveFieldHandler,
			'change: [data-role="configs-change-type"]': this.changeTypeHandler,
			'click: [data-role="btn-config-field"]': this.clickOpenSettingsHandler
		}
	}

	constructor(node, store) {
		super(node)

		this.store = store

		this.rowSelector = '[data-role="row-module-fields"]'

		this.openedConfigs = null
		this.indexFieldConfigsModalOpen = false
	}

	changeFieldTitleHandler(event) {
		const container = event.target.closest('[data-role="row-module-fields"]')
		const index = Number(container.dataset.index)
		const state = this.store.getState()
		const fields = state.fields.slice(0)

		fields[index].title = event.target.value

		this.store.setState({ fields })
	}

	changeFieldAliasHandler(event) {
		const container = event.target.closest('[data-role="row-module-fields"]')
		const index = Number(container.dataset.index)
		const state = this.store.getState()
		const fields = state.fields.slice(0)

		fields[index].alias = event.target.value

		this.store.setState({ fields })
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

		const ConfigComponent = module.default

		this.openedConfigs = new ConfigComponent({
			...field.settings
		}, {
			onSubmit: this.submitSettingsFormHandler.bind(this),
			onClose: this.cancelSettingsFormHandler.bind(this)
		}, {
			fields: state.fields,
			types: state.types,
			storages: state.storages,
			collections: state.collections
		})

		this.openedConfigs.open()
	}

	submitSettingsFormHandler(configsModalState) {
		const state = this.store.getState()
		const fields = [ ...state.fields ]

		fields[this.indexFieldConfigsModalOpen].settings = configsModalState
		console.log('submited field configs')
		console.log(fields[this.indexFieldConfigsModalOpen])
		this.store.setState({ fields })
		this.openedConfigs.close()
	}

	cancelSettingsFormHandler() {
		this.openedConfigs.destroy()
	}

	clickAddFieldHandler(e) {
		createAction('ADD_EMPTY_FIELD')
	}

	clickRemoveFieldHandler(e) {
		const row = e.target.closest(this.rowSelector)
		const index = Number(row.dataset.index)

		createAction('REMOVE_FIELD', { index })
	}

	changeTypeHandler(e) {
		const row = e.target.closest(this.rowSelector)
		const type = e.target.value
		const index = row.dataset.index

		createAction('FIELD_CHANGE_TYPE', { type, index })
	}
}
