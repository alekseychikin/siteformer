const mouseFocusedClass = 'is-mouse-focused'
let activeElement

function blurHandler(e) {
	e.target.removeEventListener(e.type, blurHandler)

	activeElement.classList.remove(mouseFocusedClass)
}

document.body.addEventListener('mousedown', () => {
	setTimeout(() => {
		activeElement = document.activeElement

		if (activeElement && activeElement !== document.body) {
			activeElement.classList.add(mouseFocusedClass)
			activeElement.addEventListener('blur', blurHandler)
		}
	}, 0)
})
