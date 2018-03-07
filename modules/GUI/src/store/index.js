import { createStore as createStoreOrigin } from '../libs/store'

import fields from './fields'

import { handleActions } from '../libs/dispatch'

export async function createStore (setStateHandler) {
	const store = await createStoreOrigin(setStateHandler)

	handleActions({
		...fields
	}, store)

	return store
}
