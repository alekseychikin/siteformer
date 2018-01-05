import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-collection.gutt'

export default class ConfigsCollection extends Modal {
	get events() {
		return {
			'change: [data-role="configs-collection-collection"]': this.changeCollectionHandler,
			'change: [data-role="configs-collection-field"]': this.changeFieldHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers, params) {
		const { collections } = params

		super(configsTemplate, handlers)

		this.state = state
		this.state.collections = collections

		this.render()
		this.open()
	}

	changeCollectionHandler(event) {
		this.state.collection = event.target.value

		this.render()
	}

	changeFieldHandler(event) {
		this.state.field = event.target.value

		this.render()
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				collection: this.state.collection,
				field: this.state.field
			})
		}

		return false
	}
}
