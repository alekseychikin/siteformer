import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-image.gutt'
import SFAPI from '../../libs/sf-api'

export default class ConfigsImage extends Modal {
	get events() {
		return {
			'click: [data-role="configs-image-check-path"]': this.clickCheckPathHandler,
			'change: [data-role="configs-image-storage"]': this.changeStorageHandler,
			'input change: [data-role="configs-image-path"]': this.changePathHandler,
			'input change: [data-role="configs-image-width"]': this.changeWidthHandler,
			'input change: [data-role="configs-image-height"]': this.changeHeightHandler,
			'change: [data-role="configs-image-save-ratio"]': this.changeSaveRatioHandler,
			'change: [data-role="configs-image-source"]': this.changeSourceHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers, params) {
		const { storages, fields, currentField } = params

		super(configsTemplate, handlers)

		this.state = state
		this.state.storages = [ ...storages ]
		this.state.isWritablePath = 'NOTCHECKED'
		this.state.sources = this.getSources(fields, currentField)

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	getSources(fields, field) {
		return fields.filter(item => item.alias !== field.alias)
	}

	async clickCheckPathHandler() {
		const { storage, path } = this.state

		console.log(storage, path)

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

	changeSaveRatioHandler(event) {
		this.state.saveRatio = event.target.checked
	}

	changeSourceHandler(event) {
		this.state.source = event.target.value
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
