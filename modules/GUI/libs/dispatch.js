const subscribes = {}

export default function dispatch (action) {
	if (subscribes[action.type]) {
		subscribes[action.type].forEach(handler => handler(action.payload))
	}
}

export function handleActions(handlers) {
	for (const type in handlers) {
		if (!subscribes[type]) {
			subscribes[type] = []
		}

		subscribes[type].push(handlers[type])
	}
}

export function createAction(type, payload) {
	return dispatch({
		type,
		payload
	})
}
