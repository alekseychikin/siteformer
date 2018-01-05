const fields = {
	'ADD_EMPTY_FIELD': (store, payload) => {
		const state = store.getState()
		const emptyField = {
			alias: '',
			position: 0,
			required: false,
			settings: {},
			title: '',
			type: 'string'
		}

		store.setState({fields: [...state.fields, emptyField]})
	},
	'REMOVE_FIELD': (store, payload) => {
		const state = store.getState()

		store.setState({ fields: state.fields.filter((field, index) => index !== payload.index) })
	},
	'FIELD_CHANGE_TYPE': (store, { type: fieldType, index }) => {
		const state = store.getState()
		const fields = [ ...state.fields ]
		const types = [ ...state.types ]
		const [ type ] = types.filter(item => item.type === fieldType)

		fields[index].type = fieldType
		fields[index].settings = type.defaultSettings

		store.setState(store, { fields })
	},
	'CONFIGS_ADD_OPEN_SETTINGS': (store, { index }) => {
		const state = store.getState()
		const field = state.fields[index]
		const [ type ] = state.types.filter(item => item.type === field.type)

		store.setState({ openConfigs: {
			index,
			component: new ConfigsComponents[field.type]({
				...type.defaultSettings
			})
		}})
	}
}

export default fields
