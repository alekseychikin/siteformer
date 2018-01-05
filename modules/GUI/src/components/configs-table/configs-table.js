import Modal from '../modal/modal'
import renderino from '../../libs/renderino'
import configsTemplate from './configs-table.gutt'

export default class ConfigsTable extends Modal {
	get events() {
		return {
			'input change: [data-role="configs-table-cell"]': this.changeTableCellHandler,
			'click: [data-role="configs-table-add-column"]': this.clickAddColumnHandler,
			'click: [data-role="configs-table-remove-column"]': this.clickRemoveColumnHandler,
			'click: [data-role="configs-table-add-row"]': this.clickAddRowHandler,
			'click: [data-role="configs-table-remove-row"]': this.clickRemoveRowHandler,
			'submit: [data-role="configs-form"]': this.subitFormHandler,
			'click: [data-role="cancel"]': this.close,
			...super.events
		}
	}

	constructor(state, handlers) {
		super(configsTemplate, handlers)

		this.state = state

		if (!this.state.data.length) {
			this.state.data.push(['', '', '', ''])
			this.state.data.push(['', '', '', ''])
			this.state.data.push(['', '', '', ''])
		}

		this.render()
		this.open()

		this.node.querySelector('input[type="text"]:first-child').focus()
	}

	clickAddColumnHandler(event) {
		const container = event.target.closest('[data-role="configs-table-container"]')
		const index = Number(event.target.dataset.index)
		const column = Number(container.dataset.column)
		const row = Number(container.dataset.row)
		const data = this.state.data.slice(0)

		data.forEach(columns => columns.splice(index + 1, 0, ' '))

		this.state.data = data

		this.render()
	}

	clickRemoveColumnHandler(event) {
		const container = event.target.closest('[data-role="configs-table-container"]')
		const index = Number(event.target.dataset.index)
		const column = Number(container.dataset.column)
		const row = Number(container.dataset.row)
		const data = this.state.data.slice(0)

		data.forEach(columns => columns.splice(index, 1))

		this.state.data = data

		this.render()
	}

	clickAddRowHandler(event) {
		const container = event.target.closest('[data-role="configs-table-container"]')
		const index = Number(event.target.dataset.index)
		const column = Number(container.dataset.column)
		const row = Number(container.dataset.row)
		const data = this.state.data.slice(0)
		const columnsAmount = data[0].length
		const addColumn = []

		for (let i = 0; i < columnsAmount; i++) {
			addColumn.push(' ')
		}

		data.splice(index + 1, 0, addColumn)

		this.state.data = data

		this.render()
	}

	clickRemoveRowHandler(event) {
		const container = event.target.closest('[data-role="configs-table-container"]')
		const index = Number(event.target.dataset.index)
		const column = Number(container.dataset.column)
		const row = Number(container.dataset.row)
		const data = this.state.data.slice(0)
		const columnsAmount = data[0].length

		data.splice(index, 1)

		this.state.data = data

		this.render()
	}

	changeTableCellHandler(event) {
		const container = event.target.closest('[data-role="configs-table-container"]')
		const row = Number(container.dataset.row)
		const column = Number(container.dataset.column)
		const value = event.target.value
		const data = this.state.data.slice(0)

		data[row][column] = value

		this.state.data = data
	}

	subitFormHandler(e) {
		e.preventDefault()

		if (this.handlers.onSubmit) {
			this.handlers.onSubmit({
				data: this.state.data
			})
		}

		return false
	}
}
