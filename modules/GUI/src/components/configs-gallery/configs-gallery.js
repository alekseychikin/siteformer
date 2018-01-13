import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-gallery.gutt'
import SFAPI from '../../libs/sf-api'

export default class ConfigsGallery extends Modal {
	get events() {
		return {
			'click: [data-role="configs-gallery-check-path"]': this.clickCheckPathHandler,
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
		this.state.isWritablePath = 'NOTCHECKED'

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	async clickCheckPathHandler() {
		const { storage, path } = this.state

		if (storage.length && path.length) {
			try {
				this.state.isWritablePath = 'CHECKING'

				this.render()

				await SFAPI.get({
					writable: `gui-storages?action=checkWritablePath&storage=${storage}&path=${path}&index=path`
				})

				this.state.error = false
				this.state.isWritablePath = 'OKAY'

				this.render()
			} catch ({ error }) {
				this.state.error = error
				this.state.isWritablePath = 'NOTCHECKED'

				this.render()
			}
		} else {
			this.state.error = {
				code: 'EVALUESNOTMATCHED',
				index: ['storage'],
				source: this.state.storage
			}
			this.state.isWritablePath = 'NOTCHECKED'

			this.render()
		}
	}

	changeStorageHandler(event) {
		this.state.storage = event.target.value
		this.state.error = false

		this.render()
	}

	changePathHandler(event) {
		this.state.path = event.target.value
		this.state.isWritablePath = 'NOTCHECKED'
		this.state.error = false

		this.render()
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
				saveRatio: this.state.saveRatio
			})
		}

		return false
	}
}
