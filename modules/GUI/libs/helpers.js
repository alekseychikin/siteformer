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

export function sendFile (url, data) {
	return new Promise(function (resolve, reject) {
		let formData = ''

		if (window.FormData) {
			formData = new FormData()

			for (const field in data) {
				const input = data[field]

				if (input.getAttribute('type').toLowerCase() === 'file') {
					for (const i in input.files) {
						formData.append(`${field}[${i}]`, input.files[i])
					}
				}
			}
		} else {
			console.error('not supporting FormData')
		}

		const req = new XMLHttpRequest()
		req.open('POST', url, true)
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		req.setRequestHeader('Accept', 'application/json')
		req.onreadystatechange = readyStateChange(req, resolve, reject)
		req.send(formData)
	})
}

export function fetch (url) {
	return new Promise(function (resolve, reject) {
		const req = new XMLHttpRequest()
		req.open('GET', url, true)
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		req.setRequestHeader('Accept', 'application/json')
		req.onreadystatechange = readyStateChange(req, resolve, reject)
		req.send()
	})
}

function parsePostData (postData, name = '') {
	if (~['string', 'number', 'boolean'].indexOf(typeof postData)) {
		return `${name}=${encodeURIComponent(postData)}`
	} else if (postData instanceof Array) {
		const data = []

		for (const i in postData) {
			data.push(parsePostData(postData[i], (name.length ? `${name}[${i}]` : i)))
		}

		return data.join('&')
	} else if (typeof postData === 'object') {
		const data = []

		for (const i in postData) {
			if (!(Object.prototype.hasOwnProperty.call(postData, i))) continue

			data.push(parsePostData(postData[i], (name.length ? `${name}[${i}]` : i)))
		}

		return data.join('&')
	}
}

export function sendPost (url, data) {
	return new Promise(function (resolve, reject) {
		const req = new XMLHttpRequest()
		req.open('POST', url, true)
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
		req.setRequestHeader('Accept', 'application/json')
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
		req.onreadystatechange = readyStateChange(req, resolve, reject)
		req.send(parsePostData(data))
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
