import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-file.gutt'

export default class ConfigsFile extends Modal {
	get events() {
		return {
			'change: [data-role="configs-file-storage"]': this.changeStorageHandler,
			'input change: [data-role="configs-file-path"]': this.changePathHandler,
			'input change: [data-role="configs-file-ext"]': this.changeExtHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers, params) {
		const { storages } = params

		super(configsTemplate, handlers)

		this.state = state
		this.state.storages = [ ...storages ]

		this.setDefaultState()

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	changeStorageHandler(event) {
		this.state.storage = event.target.value
	}

	changePathHandler(event) {
		this.state.path = event.target.value
	}

	changeExtHandler(event) {
		this.state.ext = event.target.value
	}

	setDefaultState() {
		const [ storage ] = this.state.storages

		if (!this.state.storage) {
			this.state.storage = storage
		}
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				storage: this.state.storage,
				path: this.state.path,
				ext: this.state.ext
			})
		}

		return false
	}
}
