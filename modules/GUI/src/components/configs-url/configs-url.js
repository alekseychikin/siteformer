import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-url.gutt'

export default class ConfigsUrl extends Modal {
	get events() {
		return {
			'change: [data-role="configs-url-field"]': this.changeSourceHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers, params) {
		const { fields } = params;

		super(configsTemplate, handlers)

		this.state = state
		this.state.fields = [ ...fields ]

		if (!this.state.source) {
			this.setDefaultSource()
		}

		this.render()
		this.open()
	}

	setDefaultSource() {
		const [ stringField ] = this.state.fields.filter(item => item.type === 'string' && item.alias)

		if (stringField) {
			this.state.source = stringField.alias
		}
	}

	changeSourceHandler(event) {
		this.state.source = event.target.value
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				source: this.state.source
			})
		}

		return false
	}
}
