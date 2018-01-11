import { createStore as createStoreOrigin } from '../libs/store'

import fields from './fields'
import configsForm from './configs-form'

import { handleActions } from '../libs/dispatch'

export async function createStore (setStateHandler) {
	const store = await createStoreOrigin(setStateHandler)

	handleActions({
		...fields,
		...configsForm
	}, store)

	return store
}
