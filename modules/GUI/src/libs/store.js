import { fetch } from './helpers'

export class Store {
	constructor(initialState, setStateHandler = () => undefined) {
		this.state = initialState
		this.setStateHandler = setStateHandler
	}

	setState(obj) {
		for (const key in obj) {
			this.state[key] = obj[key]
		}

		if (this.setStateHandler) {
			this.setStateHandler(this)
		}
	}

	getState() {
		return { ...this.state }
	}
}

export async function createStore(setStateHandler = () => {}) {
	const state = await fetch(window.location.href)

	return new Store(state, setStateHandler)
}
