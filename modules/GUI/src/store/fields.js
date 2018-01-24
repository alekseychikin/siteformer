const fields = {
	'FIELDS_ADD_EMPTY': (store, payload) => {
		const state = store.getState()
		const lastPosition = state.fields.reduce((previous, item) => (
			Math.max(previous, item.position)
		), 1)
		const emptyField = {
			alias: '',
			position: lastPosition + 1,
			required: false,
			settings: {},
			title: '',
			type: 'string'
		}

		store.setState({fields: [...state.fields, emptyField]})
	},
	'REMOVE_FIELD_BY_INDEX': (store, { index }) => {
		const state = store.getState()

		store.setState({ fields: state.fields.filter((field, indx) => indx !== index) })
	},
	'FIELDS_CHANGE_TITLE': (store, { index, title }) => {
		const state = store.getState()
		const fields = [ ...state.fields ]

		fields[index].title = title

		store.setState({ fields })
	},
	'FIELDS_CHANGE_ALIAS': (store, { index, alias }) => {
		const state = store.getState()
		const fields = [ ...state.fields ]

		fields[index].alias = alias

		store.setState({ fields })
	},
	'FIELDS_CHANGE_TYPE': (store, { type: fieldType, index }) => {
		const state = store.getState()
		const fields = [ ...state.fields ]
		const types = [ ...state.types ]
		const [ type ] = types.filter(item => item.type === fieldType)

		fields[index].type = fieldType
		fields[index].settings = type.defaultSettings

		store.setState({ fields })
	},
	'FIELDS_CHANGE_SETTINGS': (store, { index, settings }) => {
		const state = store.getState()
		const fields = [ ...state.fields ]

		fields[index].settings = settings

		store.setState({ fields })
	}
}

export default fields
