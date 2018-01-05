import { fetch, throttle, skipLastQuery, skipEmptyQuery } from '../../libs/helpers'

export default CollectionItemCollection {
	constructor() {
		this.bindedSetResults = this.setResults.bind(this)
		this.bindedEmptySearch = this.emptySearch.bind(this)
	}

	search (value) {
		Promise.resolve(value)
			.then(skipLastQuery(this.state.alias))
			.then(skipEmptyQuery)
			.then(throttle(500))
			.then(fetch('/cms/types/section/search/', this.state.section, this.state.field))
			.then(this.bindedSetResults)
			.catch(this.bindedEmptySearch)
	}

	setResults(data) {
		console.log('data')
		console.log(data)
	}

	emptySearch() {
		console.log('empty search')
	}
}
