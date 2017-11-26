const components = []

const instances = []

const observer = new MutationObserver(mutations => {
	mutations.forEach (mutation => {
		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach (element => {
				if (element.nodeType === 1) {
					components.forEach(Component => {
						if (element.matches(Component.selector)) {
							instances.push({
								instance: new Component(element),
								element
							})
						}
					})
				}
			})

			mutation.removedNodes.forEach (element => {
				if (element.nodeType === 1) {
					components.forEach(Component => {
						if (element.matches(Component.selector)) {
							instances.forEach(instance => {
								if (instance.element === element && typeof instance.instance.destroy === 'function') {
									instance.instance.destroy()
								}
							})
						}
					})
				}
			})
		}
	})
})

const config = {
	attributes: true,
	childList: true,
	characterData: true,
	subtree: true
}

observer.observe(document.body, config)

components.forEach(Component => {
	Array.from(document.querySelectorAll(Component.selector)).forEach(element => {
		instances.push({
			instance: new Component(element),
			element: element
		})
	})
})

export default function registerComponent (Component) {
	if (!Array.isArray(Component)) {
		Component = [Component]
	}

	Component.forEach(Component => {
		Array.from(document.querySelectorAll(Component.selector)).forEach(element => {
			instances.push({
				instance: new Component(element),
				element: element
			})
		})

		components.push(Component)
	})
}
