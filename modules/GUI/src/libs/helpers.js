export function asyncImageLoadHandler (node) {
	return new Promise((resolve, reject) => {
		if (node.complete) resolve()

		node.addEventListener('load', resolve)
		node.addEventListener('error', reject)
	})
}


export function getTransitionDurations (node) {
	let transitionDurations

	if (typeof getComputedStyle === 'function') {
		transitionDurations = getComputedStyle(node).transitionDuration
	} else [
		transitionDurations = node.currentStyle.transitionDuration
	]

	transitionDurations = transitionDurations
		.split(',')
		.map(value => value.trim().match(/([\d.]+)(ms|s)/))
		.map(value => value[2] === 's' ? Number(value[1]) * 1000 : Number(value[1]))

	return Math.max.apply(Math, transitionDurations)
}

export function getCookie (name) {
	const matches = document.cookie.match(new RegExp(
		'(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)'
	))

	return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie (name, value, options = {}) {
	let expires = options.expires

	if (typeof expires === 'number' && expires) {
		const d = new Date()

		d.setTime(d.getTime() + expires * 1000)

		expires = options.expires = d
	}

	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString()
	}

	value = encodeURIComponent(value)

	let updatedCookie = `${name}=${value}`

	for (const propName in options) {
		updatedCookie += `; ${propName}`

		const propValue = options[propName]

		if (propValue !== true) {
			updatedCookie += `=${propValue}`
		}
	}

	document.cookie = updatedCookie
}

export function getStyle (node) {
	return window.getComputedStyle ? getComputedStyle(node, '') : node.currentStyle
}

function readyStateChange (req, resolve, reject) {
	return function () {
		if (req.readyState !== 4) return false

		let result = false

		try {
			if (req.responseText.length) {
				result = JSON.parse(req.responseText)
			}
		} catch (e) {
			result = req.responseText
		}

		if (req.status !== 200 && req.status !== 304) {
			reject(result)
		} else {
			resolve(result)
		}
	}
}

const defaultFetchHeaders = {
	'X-Requested-With': 'XMLHttpRequest'
}

export function fetch (url, params = {}) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest()
		const { headers: srcHeaders = {}, onProgress } = params
		const headers = Object.assign({}, defaultFetchHeaders, srcHeaders)

		xhr.open('GET', url, true)

		for (const header in headers) {
			xhr.setRequestHeader(header, headers[header])
		}

		xhr.setRequestHeader('Accept', 'application/json')
		xhr.onreadystatechange = readyStateChange(xhr, resolve, reject)

		if (typeof onProgress === 'function') {
			xhr.upload.onprogress = onProgress
		}

		xhr.send()
	})
}

const defaultPostHeaders = {
	'X-Requested-With': 'XMLHttpRequest',
	'Accept': 'application/json'
}

function preparePostData (data, formData = new FormData(), name = '') {
	for (const field in data) {
		const value = data[field]
		const fieldName = name.length ? `${name}[${field}]` : field

		if (typeof value !== 'object' || value instanceof File || value === null) {
			formData.append(fieldName, value)
		} else {
			preparePostData(value, formData, fieldName)
		}
	}

	return formData
}

export function sendPost (url, data, params = {}) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest()
		const { headers: srcHeaders = {}, onProgress } = params
		const headers = Object.assign({}, defaultPostHeaders, srcHeaders)

		xhr.open('POST', url, true)

		for (const header in headers) {
			xhr.setRequestHeader(header, headers[header])
		}

		xhr.onreadystatechange = readyStateChange(xhr, resolve, reject)

		if (typeof onProgress === 'function') {
			xhr.upload.onprogress = onProgress
		}

		xhr.send(preparePostData(data))
	})
}

export function emitEvent (element, eventName, params = {}) {
	const event = document.createEvent('HTMLEvents')

	event.initEvent(eventName, true, true)

	for (const key in params) {
		event[key] = params[key]
	}

	element.dispatchEvent(event)
}

export const skipEmptyQuery = (value) => new Promise((resolve, reject) => {
	if (value) {
		resolve(value)
	}

	reject()
})

let throttleTimeoutResolve = false
let throttleTimeout = false

const timeoutHandler = (resolve, query) => () => {
	clearTimeout(throttleTimeout)
	throttleTimeout = false
	resolve(query)
}

export const throttle = (timeout) => (query) => new Promise((resolve) => {
	if (!throttleTimeoutResolve) {
		resolve(query)
	}

	if (throttleTimeoutResolve) {
		clearTimeout(throttleTimeoutResolve)
	}

	if (!throttleTimeout) {
		throttleTimeout = setTimeout(timeoutHandler(resolve, query), timeout)
	}

	throttleTimeoutResolve = setTimeout(timeoutHandler(resolve, query), timeout)
})

const lastQueries = {}

export const skipLastQuery = (collection) => (query) => new Promise((resolve) => {
	if (!lastQueries[collection]) {
		lastQueries[collection] = ''
	}

	if (lastQueries[collection] !== query) {
		lastQueries[collection] = query
		resolve(query)
	}
})
