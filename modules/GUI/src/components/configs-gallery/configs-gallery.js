import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-gallery.gutt'

export default class ConfigsGallery extends Modal {
	get events() {
		return {
			'change: [data-role="configs-gallery-storage"]': this.changeStorageHandler,
			'input change: [data-role="configs-gallery-path"]': this.changePathHandler,
			'input change: [data-role="configs-gallery-width"]': this.changeWidthHandler,
			'input change: [data-role="configs-gallery-height"]': this.changeHeightHandler,
			'input change: [data-role="configs-gallery-preview-width"]': this.changePreviewWidthHandler,
			'input change: [data-role="configs-gallery-preview-height"]': this.changePreviewHeightHandler,
			'change: [data-role="configs-gallery-save-ratio"]': this.changeSaveRatioHandler,
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

	changePreviewWidthHandler(event) {
		this.state.previewWidth = event.target.value
	}

	changePreviewHeightHandler(event) {
		this.state.previewHeight = event.target.value
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
				previewWidth: this.state.previewWidth,
				previewHeight: this.state.previewHeight,
				source: this.state.source,
				saveRatio: this.state.saveRatio
			})
		}

		return false
	}
}
