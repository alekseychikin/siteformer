import SFAPI from '../libs/sf-api'
import { createAction } from '../libs/dispatch'

const configsForm = {
	'CONFIGS_UPDATE_TITLE': (store, { title }) => {
		store.setIn('page', { title })
		store.setState({ error: false })
	},
	'CONFIGS_UPDATE_ALIAS': (store, { alias }) => {
		store.setIn('page', { alias })
		store.setState({ error: false })
	},
	'CONFIGS_SAVE_FORM': async (store) => {
		const state = store.getState()

		try {
			await SFAPI.post({
				'gui-collections': {
					...state.page,
					fields: state.fields
				}
			}, {
				'collectionId': `gui-collections?collection=places&field=id`
			})

			store.setState({ error: false })
		} catch ({ error }) {
			store.setState({ error })
		}
	},
	'CONFIGS_CLEAR_ERROR': (store) => {
		store.setState({ error: false })
	}
}

export default configsForm
