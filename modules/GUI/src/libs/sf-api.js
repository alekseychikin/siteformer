import { fetch, sendPost } from './helpers'

class CatchError {
	constructor(message) {
		for (const key in message) {
			this[key] = message[key]
		}
	}
}

export default class SFAPI {
	static get(data, params = {}) {
		const url = SFAPI.getUrl(data)

		return fetch(url, params)
			.then(data => {
				if (data && data.debug) {
					console.groupCollapsed('Served debug info') // eslint-disable-line
					console.log(data.debug) // eslint-disable-line
					console.groupEnd() // eslint-disable-line
				}

				return data
			})
			.catch(error => {
				if (error && error.debug) {
					console.groupCollapsed('Served debug info') // eslint-disable-line
					console.log(error.debug) // eslint-disable-line
					console.groupEnd() // eslint-disable-line
				}

				throw new CatchError(error)
			})
	}

	static post(postData = {}, getData = {}, params = {}) {
		const url = SFAPI.getUrl(getData)

		return sendPost(url, postData, params)
			.then(data => {
				if (data && data.debug) {
					console.groupCollapsed('Served debug info') // eslint-disable-line
					console.log(data.debug) // eslint-disable-line
					console.groupEnd() // eslint-disable-line
				}

				return data
			})
			.catch(error => {
				if (error && error.debug) {
					console.groupCollapsed('Served debug info') // eslint-disable-line
					console.log(error.debug) // eslint-disable-line
					console.groupEnd() // eslint-disable-line
				}

				throw new CatchError(error)
			})
	}

	static getUrl(data) {
		return `/index.php?graph=${encodeURIComponent(JSON.stringify(data))}`
	}
}
