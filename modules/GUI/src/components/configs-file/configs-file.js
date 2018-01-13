import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-file.gutt'
import SFAPI from '../../libs/sf-api'

export default class ConfigsFile extends Modal {
	get events() {
		return {
			'click: [data-role="configs-file-check-path"]': this.clickCheckPathHandler,
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
		this.state.isWritablePath = 'NOTCHECKED'
		this.state.path = event.target.value

		this.render()
	}

	changeExtHandler(event) {
		this.state.ext = event.target.value
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
