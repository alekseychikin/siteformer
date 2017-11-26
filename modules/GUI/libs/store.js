import {fetch} from 'libs/helpers'

class Store {
	constructor(initialState, setStateHandler) {
		this.state = initialState
		this.setStateHandler = setStateHandler
	}

	setState(obj) {
		for (const key in obj) {
			this.state[key] = obj[key]
		}

		this.setStateHandler(this)
	}

	getState() {
		return this.state
	}
}

export async function getStore(setStateHandler = () => {}) {
	const state = await fetch(window.location.href)

	return new Store(state, setStateHandler)
}
