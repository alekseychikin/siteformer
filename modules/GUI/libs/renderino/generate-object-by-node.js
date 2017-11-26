var _hasProp = Object.prototype.hasOwnProperty;

function getAttributes(node) {
	var attrs = {};
	var attrName;

	for (attrName in node.attributes) {
		if (_hasProp.call(node.attributes, attrName)) {
			attrName = node.attributes[attrName].name;
			attrs[attrName] = node.getAttribute(attrName);
		}
	}

	node = null;

	return attrs;
}

function generateObjectByNode(children) {
	var obj = [];
	var nodeObj;
	var child;
	var i;

	for (i = 0; i < children.length; i++) {
		child = children[i];

		switch (child.nodeType) {
			case 3: // text node
				if (child.nodeValue.trim().length) {
					obj.push(child.nodeValue);
				} else {
					child.parentNode.removeChild(child);
					i--;
				}

				break;
			case 1: // tag
				obj.push({
					tag: child.nodeName.toLowerCase(),
					attrs: getAttributes(child),
					children: generateObjectByNode(child.childNodes)
				});

				break;
		}
	}

	children = null;
	child = null;

	return obj;
}

module.exports = generateObjectByNode;