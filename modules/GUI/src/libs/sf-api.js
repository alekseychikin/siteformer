import { fetch, sendPost } from './helpers'

class CatchError {
	constructor(message) {
		for (let key in message) {
			this[key] = message[key]
		}
	}
}

export default class SFAPI
{
	static get(data, headers = {}) {
		const url = SFAPI.getUrl(data)

		return fetch(url, headers)
			.then(data => {
				if (data && data.debug) {
					console.groupCollapsed('Served debug info')
					console.log(data.debug)
					console.groupEnd();
				}

				return data
			})
			.catch(error => {
				if (error && error.debug) {
					console.groupCollapsed('Served debug info')
					console.log(error.debug)
					console.groupEnd();
				}

				throw new CatchError(error)
			})
	}

	static post(postData, getData, headers = {}) {
		const url = SFAPI.getUrl(getData)
		const data = {}

		for (let model in postData) {
			data[model] = JSON.stringify(postData[model])
		}

		return sendPost(url, data, headers)
			.then(data => {
				console.log('return', data)

				if (data && data.debug) {
					console.groupCollapsed('Served debug info')
					console.log(data.debug)
					console.groupEnd();
				}

				return data
			})
			.catch(error => {
				if (error && error.debug) {
					console.groupCollapsed('Served debug info')
					console.log(error.debug)
					console.groupEnd();
				}

				throw new CatchError(error)
			})
	}

	static getUrl(data) {
		return `/index.php?graph=${encodeURIComponent(JSON.stringify(data))}`
	}
}