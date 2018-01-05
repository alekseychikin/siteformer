import Component from '../../libs/component'

export default class Editarea extends Component {
	static get selector() {
		return '.editarea__input'
	}

	constructor(node) {
		super(node)

		console.log('constructor editorarea')
	}
}
