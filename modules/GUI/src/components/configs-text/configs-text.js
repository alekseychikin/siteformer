import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-text.gutt'

export default class ConfigsText extends Modal {
	get events() {
		return {
			'change input: [data-role="configs-text-default-text"]': this.changeTextHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers) {
		super(configsTemplate, handlers)

		this.state = state

		this.render()
		this.open()

		this.node.querySelector('textarea').focus()
	}

	changeTextHandler(event) {
		this.state.text = event.target.value
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				text: this.state.text
			})
		}

		return false
	}
}
