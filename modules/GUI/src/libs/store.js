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

	setIn(path, changer) {
		const object = this.getObjectByPath(path)
		let changes = changer

		if (typeof changer === Function) {
				changes = changer(object)
		}

		Object.keys(changes).forEach(key => {
			if (changes[key] === null || changes[key] === undefined) {
				object[key] = changes[key]
			} else if (changes[key].constructor === Array) {
				object[key] = [ ...changes[key] ]
			} else if (changes[key].constructor === Object) {
				object[key] = { ...changes[key] }
			} else {
				object[key] = changes[key]
			}
		})

		if (this.setStateHandler) {
			this.setStateHandler(this)
		}
	}

	getObjectByPath(path, updatePath = true) {
		let parentLink = this.state

		if (!path) {
			return parentLink
		}

		const paths = path.split('.')

		paths.forEach((key) => {
			if (updatePath) {
				if (!parentLink[key]) {
					parentLink[key] = {}
				} else if (parentLink[key].constructor === Array) {
					parentLink[key] = [ ...parentLink[key] ]
				} else if (parentLink[key].constructor === Object) {
					parentLink[key] = { ...parentLink[key] }
				}
			}

			if (typeof parentLink[key] === 'object') {
				parentLink = parentLink[key]
			}
		})

		return parentLink
	}

	getState() {
		return { ...this.state }
	}
}

export async function createStore(setStateHandler = () => {}) {
	const state = await fetch(window.location.href)

	return new Store(state, setStateHandler)
}
