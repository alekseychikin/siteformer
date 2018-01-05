module.exports = function prepareTemplate(tree) {
	var result = []

	tree.forEach(function (item) {
		if (typeof item === 'string' && item.trim().length) {
			return result.push(item);
		}

		if (typeof item === 'number') {
			return result.push(item.toString());
		}

		if (typeof item !== 'string') {
			return result.push({
				tag: item.tag,
				attrs: item.attrs,
				children: prepareTemplate(item.children)
			})
		}
	})

	return result
}
