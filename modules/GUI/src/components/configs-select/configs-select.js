import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-select.gutt'

export default class ConfigsSelect extends Modal {
	get events() {
		return {
			'input change: [data-role="configs-select-option-label"]': this.changeOptionValueHandler,
			'click: [data-role="option-remove"]': this.clickRemoveOptionHandler,
			'click: [data-role="add-value"]': this.clickAddOptionHandler,
			'change: [data-role="configs-select-option"]': this.changeOptionCheckedHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers) {
		super(configsTemplate, handlers)

		this.state = state

		if (!this.state.values.length) {
			this.state.values.push('')
		}

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	changeOptionCheckedHandler(event) {
		const checked = Number(event.target.value)

		this.state.checked = checked
	}

	clickRemoveOptionHandler(event) {
		const index = Number(event.target.dataset.index)

		const values = this.state.values.filter((value, indx) => index !== indx)

		this.state.values = values

		this.render()
	}

	clickAddOptionHandler() {
		const values = this.state.values.concat([''])

		this.state.values = values

		this.render()
	}

	changeOptionValueHandler(event) {
		const target = event.target
		const index = Number(target.dataset.index)
		const value = target.value

		const values = [ ...this.state.values ]

		values[index] = value

		this.state.values = values
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				checked: this.state.checked,
				values: this.state.values
			})
		}

		return false
	}
}
