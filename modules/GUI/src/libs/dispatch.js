const subscribes = {}
let preservedStore

export default function dispatch (action) {
	if (subscribes[action.type]) {
		subscribes[action.type].forEach(handler => handler(preservedStore, action.payload))
	}
}

export function handleActions(handlers, store) {
	for (const type in handlers) {
		if (!subscribes[type]) {
			subscribes[type] = []
		}

		subscribes[type].push(handlers[type])
	}

	preservedStore = store
}

export function createAction(type, payload) {
	return dispatch({
		type,
		payload
	})
}

export function connect(component, store) {
	return class Connected extends component {
		constructor(node) {
			super(node, store)
		}
	}
}
