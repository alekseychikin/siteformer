import Component from '../../libs/component'
import renderino from '../../libs/renderino'

export default class Modal extends Component {
	get events() {
		return {
			'click': this.close
		}
	}

	constructor(configsTemplate, handlers) {
		const node = document.querySelector('[data-role="modal"]')

		super(node)

		this.state = {}
		this.handlers = handlers
		this.nodeContainer = this.node.querySelector('[data-role="modal-container"]')
		this.renderer = renderino(configsTemplate, this.nodeContainer)
	}

	open() {
		this.node.classList.add('modal--open')
	}

	close() {
		this.node.classList.remove('modal--open')

		if (this.handlers.onClose) {
			this.handlers.onClose(this)
		}
	}

	render() {
		this.renderer(this.state)
	}

	getState() {
		return this.state
	}
}
