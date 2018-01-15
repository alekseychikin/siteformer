import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-checkbox.gutt'

export default class ConfigsCheckbox extends Modal {
	get events() {
		return {
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			'click: [data-role="add-value"]': this.clickAddValueHandler,
			'click: [data-role="option-remove"]': this.clickRemoveOptionHandler,
			'input change: [data-role="option-label"]': this.changeOptionValueHandler,
			'input change: [data-role="configs-checkbox-option"]': this.changeOptionCheckedHandler,
			...super.events
		}
	}

	constructor(state, handlers) {
		super(configsTemplate, handlers)

		this.state = state

		if (!this.state.values.length) {
			this.state.values.push({
				checked: false,
				label: ''
			})
		}

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	clickRemoveOptionHandler(event) {
		const index = Number(event.target.dataset.index)
		const value = event.target.value

		const values = this.state.values.filter((item, indx) => indx !== index)

		this.state.values = values
		this.state.error = false

		this.render()
	}

	changeOptionValueHandler(event) {
		const index = Number(event.target.dataset.index)
		const value = event.target.value

		const values = [ ...this.state.values ]

		values[index].label = value
		this.state.error = false

		this.state.values = values
	}

	changeOptionCheckedHandler(event) {
		const index = Number(event.target.dataset.index)
		const checked = event.target.checked

		const values = [ ...this.state.values ]

		values[index].checked = checked

		this.state.values = values
	}

	clickAddValueHandler() {
		const values = this.state.values.concat({
			label: '',
			checked: false
		})

		this.state.values = values
		this.state.error = false

		this.render()
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				values: this.state.values
			})
		}

		return false
	}
}
