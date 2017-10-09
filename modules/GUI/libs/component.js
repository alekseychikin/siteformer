import {emitEvent} from './helpers'

export default class {
	static get selector() {
		return ''
	}

	get events() {
		return {}
	}

	constructor(node) {
		this.node = node
		this.bindedEvents = {}
		this.bindedEventHandler = this.eventHandler.bind(this)

		for (const key in this.events) {
			const match = key.split(':')
			const event = match[0].trim()

			if (!this.bindedEvents[event]) {
				this.bindedEvents[event] = {}
				this.node.addEventListener(event, this.bindedEventHandler)
			}

			if (match.length > 1) {
				const selector = match[1].trim()

				if (!this.bindedEvents[event][selector]) {
					this.bindedEvents[event][selector] = []
				}

				this.bindedEvents[event][selector].push(this.events[key])
			} else {
				if (!this.bindedEvents[event]._) {
					this.bindedEvents[event]._ = []
				}

				this.bindedEvents[event]._.push(this.events[key])
			}
		}
	}

	eventHandler(e) {
		if (this.bindedEvents[e.type]) {
			for (const selector in this.bindedEvents[e.type]) {
				if (selector === '_') {
					if (e.target === this.node) {
						this.bindedEvents[e.type]._.forEach(handler => handler.call(this, e))
					}
				} else {
					if (e.target.matches(selector) || e.target.closest(selector)) {
						this.bindedEvents[e.type][selector].forEach(handler => handler.call(this, e))
					}
				}
			}
		}
	}

	emitEvent(eventName, params = {}) {
		emitEvent(this.node, eventName, params)
	}

	destroy() {
		for (const key in this.events) {
			const match = key.split(':')
			const event = match[0].trim()

			this.node.removeEventListener(event, this.bindedEventHandler)
		}
	}
}
