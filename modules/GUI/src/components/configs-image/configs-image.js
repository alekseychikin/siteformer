import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-image.gutt'

export default class ConfigsImage extends Modal {
	get events() {
		return {
			'change: [data-role="configs-image-storage"]': this.changeStorageHandler,
			'input change: [data-role="configs-image-path"]': this.changePathHandler,
			'input change: [data-role="configs-image-width"]': this.changeWidthHandler,
			'input change: [data-role="configs-image-height"]': this.changeHeightHandler,
			'change: [data-role="configs-image-save-ratio"]': this.changeSaveRatioHandler,
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

	changeWidthHandler(event) {
		this.state.width = event.target.value
	}

	changeHeightHandler(event) {
		this.state.height = event.target.value
	}

	changeSaveRatioHandler(event) {
		this.state.saveRatio = event.target.checked
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
				width: this.state.width,
				height: this.state.height,
				source: this.state.source,
				saveRatio: this.state.saveRatio
			})
		}

		return false
	}
}
