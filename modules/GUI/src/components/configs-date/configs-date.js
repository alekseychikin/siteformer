import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-date.gutt'

export default class ConfigsCheckbox extends Modal {
	get events() {
		return {
			'change: [data-role="configs-date-use-time"]': this.changeUseTimeHandler,
			'change: [data-role="configs-date-use-current-date"]': this.changeUseCurrentDateHandler,
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
	}

	changeUseTimeHandler(event) {
		this.state.useTime = event.target.checked
	}

	changeUseCurrentDateHandler(event) {
		this.state.useCurrentDate = event.target.checked
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				useTime: this.state.useTime,
				useCurrentDate: this.state.useCurrentDate
			})
		}

		return false
	}
}
