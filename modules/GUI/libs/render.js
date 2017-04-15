(function (factory)
{
	window.count = function (arr)
	{
		return arr.length;
	};
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = factory;
	} else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
		define('render', [], factory);
	} else {
		window.render = factory;
	}
})(function (template, node)
{
	var _hasProp = Object.prototype.hasOwnProperty;
	var nodeObjects = [];
	var singleTags = ['hr', 'br', 'base', 'col', 'embed', 'img', 'area', 'source', 'track', 'input', '!DOCTYPE', 'link', 'meta'];

	function isEqual(sourceA, sourceB) {
		var result;

		if (typeof sourceA !== typeof sourceB) {
			sourceA = null;
			sourceB = null;

			return false;
		}

		if (typeof sourceA !== 'object' && typeof sourceB !== 'object') {
			result = sourceA === sourceB;
			sourceA = null;
			sourceB = null;

			return result;
		}

		// each fields of source array and check them at dest array
		// if it not exists or not equals then return false
		if (!isEqualArraysForeach(sourceA, sourceB)) {
			sourceA = null;
			sourceB = null;

			return false;
		}

		// do the same thing with dest array
		// if dest field not exists in source array
		// or not empty then return false
		if (!isEqualArraysForeach(sourceB, sourceA)) {
			sourceA = null;
			sourceB = null;

			return false;
		}

		sourceA = null;
		sourceB = null;

		// if everything fine return true
		// arrays are equals
		return true;
	}

	function isEqualArraysForeach(sourceA, sourceB) {
		var key, value;

		for (key in sourceA) {
			if (_hasProp.call(sourceA, key)) {
				if (key === 'children') continue;
				if (typeof sourceB[key] === 'undefined') {
					sourceA = null;
					sourceB = null;

					return false;
				}

				value = sourceA[key];

				if (['string', 'boolean', 'number'].indexOf(typeof value) !== -1) {
					if (value !== sourceB[key]) {
						sourceA = null;
						sourceB = null;

						return false;
					}
				} else {
					var diffResult = isEqual(value, sourceB[key]);

					if (!diffResult) {
						sourceA = null;
						sourceB = null;

						return false;
					}
				}
			}
		}

		sourceA = null;
		sourceB = null;

		return true;
	}

	var arrDifference = (function () {
		function putElementInRes(res, element, mark, origin) {
			var putElement = {
				mark: mark,
				element: element
			};

			if (typeof origin !== 'undefined') {
				putElement.origin = origin;
			}

			res.push(putElement);
			putElement = null;
		}

		function putBufferElementsInRes(res, buffer, source, dest) {
			var i, j, len;

			for (i = 0, len = Math.min(buffer.indexesA.length, buffer.indexesB.length); i < len; i++) {
				putElementInRes(res, dest[buffer.indexesB[i]], 'edit', source[buffer.indexesA[i]]);
			}

			if (buffer.indexesA.length > buffer.indexesB.length) {
				for (j = i; j < buffer.indexesA.length; j++) {
					putElementInRes(res, source[buffer.indexesA[j]], 'delete');
				}
			} else {
				for (j = i; j < buffer.indexesB.length; j++) {
					putElementInRes(res, dest[buffer.indexesB[j]], 'add');
				}
			}

			buffer.indexesA.splice(0);
			buffer.indexesB.splice(0);

			res = null;
			buffer = null;
			source = null;
			dest = null;
		}

		function findSourceIndexInBuffer(indexes, elements, srcElement) {
			var i = 0;

			for (; i < indexes.length; i++) {
				if (isEqual(elements[indexes[i]], srcElement)) {
					indexes = null;
					elements = null;
					srcElement = null;

					return i;
				}
			}

			indexes = null;
			elements = null;
			srcElement = null;

			return false;
		}

		return function (source, dest) {
			var len;
			var res = [];
			var indexA = 0; // for source
			var indexB = 0; // for dest
			var findedIndexA;
			var findedIndexB;
			var buffer = {
				indexesA: [],
				indexesB: []
			};

			if (!source.length) {
				for (; indexB < dest.length; indexB++) {
					buffer.indexesB.push(indexB);
				}
			} else {
				while (indexA < source.length) {
					if (indexB < dest.length) {
						if (isEqual(source[indexA], dest[indexB])) {
							putBufferElementsInRes(res, buffer, source, dest);

							putElementInRes(res, dest[indexB], 'skip', source[indexA]);
						} else {
							findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);
							findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);

							if (findedIndexB !== false) {
								indexB = buffer.indexesB[findedIndexB];

								buffer.indexesB.splice(findedIndexB, buffer.indexesB.length);

								putBufferElementsInRes(res, buffer, source, dest);

								putElementInRes(res, dest[indexB], 'skip', source[indexA]);
							} else if (findedIndexA !== false) {
								indexA = buffer.indexesA[findedIndexA];

								buffer.indexesA.splice(findedIndexA, buffer.indexesA.length);

								putBufferElementsInRes(res, buffer, source, dest);

								putElementInRes(res, dest[indexB], 'skip', source[indexA]);
							} else {
								buffer.indexesA.push(indexA);
								buffer.indexesB.push(indexB);
							}
						}

						indexA++;
						indexB++;
					}

					if (indexA >= source.length || indexB >= dest.length) {
						for (; indexA < source.length; indexA++) {
							findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);

							if (findedIndexB !== false) {
								indexB = buffer.indexesB[findedIndexB];

								buffer.indexesB.splice(findedIndexB, buffer.indexesB.length);

								putBufferElementsInRes(res, buffer, source, dest);

								putElementInRes(res, dest[indexB], 'skip', source[indexA]);
								indexA++;
								indexB++;

								break;
							} else {
								buffer.indexesA.push(indexA);
							}
						}

						for (; indexB < dest.length; indexB++) {
							findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);

							if (findedIndexA !== false) {
								indexA = buffer.indexesA[findedIndexA];

								buffer.indexesA.splice(findedIndexA, buffer.indexesA.length);

								putBufferElementsInRes(res, buffer, source, dest);

								putElementInRes(res, dest[indexB], 'skip', source[indexA]);
								indexA++;
								indexB++;

								break;
							} else {
								buffer.indexesB.push(indexB);
							}
						}
					}
				}
			}

			putBufferElementsInRes(res, buffer, source, dest);

			buffer = null;
			source = null;
			dest = null;

			return res;
		}
	})();

	function cloneVirtualNode(node) {
		return typeof node === 'string' ? node : {tag: node.tag, attrs: {}, children: []};
	}

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

	var cacheObj = generateObjectByNode(node.childNodes);
	var genObj;

	function handleChildren(cacheObj, genObj, parentNode) {
		var diff = arrDifference(cacheObj, genObj);
		var newNode;
		var prevNode;
		var currNode;
		var index = 0;

		diff.forEach(function (item) {
			switch (item.mark) {
				case 'add':
					currNode = createNode(item.element);
					cacheObj.splice(index, 0, cloneVirtualNode(item.element));

					if (prevNode) {
						if (prevNode.nextSibling) {
							parentNode.insertBefore(currNode, prevNode.nextSibling);
						} else {
							parentNode.appendChild(currNode);
						}
					} else {
						if (parentNode.firstChild) {
							parentNode.insertBefore(currNode, parentNode.firstChild);
						} else {
							parentNode.appendChild(currNode);
						}
					}

					if (typeof item.element !== 'string' && typeof cacheObj[index] !== 'string') {
						handleAttrs(cacheObj[index].attrs, item.element.attrs, currNode);
						handleChildren(cacheObj[index].children, item.element.children, currNode);
					}

					prevNode = currNode;

					break;
				case 'skip':
					prevNode = parentNode.childNodes[index];

					if (typeof item.element !== 'string') {
						handleChildren(item.origin.children, item.element.children, prevNode);
					}

					break;
				case 'edit':
					currNode = parentNode.childNodes[index];

					var isSameType = typeof item.origin === typeof item.element;
					var isTwoNodes = isSameType && typeof item.element !== 'string';
					var isTwoTexts = isSameType && !isTwoNodes;
					var isSameName = isTwoNodes && item.origin.tag === item.element.tag;

					if (isSameName) {
						handleAttrs(item.origin.attrs, item.element.attrs, currNode);
						handleChildren(item.origin.children, item.element.children, currNode);
					} else {
						newNode = createNode(item.element);
						cacheObj.splice(index, 1, cloneVirtualNode(item.element));

						parentNode.insertBefore(newNode, currNode);
						parentNode.removeChild(currNode);

						if (isTwoNodes) {
							handleAttrs(cacheObj[index].attrs, item.element.attrs, newNode);
							handleChildren(cacheObj[index].children, item.element.children, newNode);
						}
					}

					prevNode = currNode;

					break;
				case 'delete':
					currNode = parentNode.childNodes[index];
					parentNode.removeChild(currNode);
					cacheObj.splice(index, 1);
					index--;

					break;
			}
			index++;
		});

		cacheObj = null;
		genObj = null;
		parentNode = null;
		diff = null;
		currNode = null;
	}

	function createNode(item) {
		if (typeof item === 'string') {
			return document.createTextNode(item);
		}

		return document.createElement(item.tag);
	}

	var logicAttrs = ['readonly', 'selected', 'checked', 'disabled', 'autofocus', 'required', 'multiple', 'autoplay', 'controls', 'loop', 'muted'];

	function handleAttrs(originAttrs, elementAttrs, currNode) {
		var attr;

		for (attr in elementAttrs) {
			if (_hasProp.call(elementAttrs, attr)) {
				if (~logicAttrs.indexOf(attr)) {
					currNode[attr] = elementAttrs[attr] !== false;
				} else if (attr === 'focus') {
					if ((typeof elementAttrs[attr] === 'boolean' && elementAttrs[attr] !== false) ||
						(typeof elementAttrs[attr] === 'number' && elementAttrs[attr] !== 0) ||
						(typeof elementAttrs[attr] === 'string' && elementAttrs[attr].length)
					) {
						currNode.focus();
					}
				} else if (attr === 'value') {
					if (currNode.nodeName.toLowerCase() === 'option') {
						currNode.setAttribute('value', elementAttrs[attr]);
					} else if (currNode.value != elementAttrs[attr]) {
						currNode.value = elementAttrs[attr];
					}
				} else {
					currNode.setAttribute(attr, elementAttrs[attr]);
				}

				originAttrs[attr] = elementAttrs[attr];
			}
		}

		for (attr in originAttrs) {
			if (_hasProp.call(originAttrs, attr)) {
				if (typeof elementAttrs[attr] === 'undefined') {
					if (~logicAttrs.indexOf(attr)) {
						currNode[attr] = false;
					} else if (attr === 'value') {
						currNode.value = '';
					} else {
						currNode.removeAttribute(attr);
					}

					delete originAttrs[attr];
				}
			}
		}
	}

	function prepareTemplate(tree) {
		var result = []

		tree.forEach(function (item) {
			if (typeof item === 'string' && item.trim().length) {
				result.push(item);
			}

			if (typeof item !== 'string') {
				result.push({
					tag: item.tag,
					attrs: item.attrs,
					children: prepareTemplate(item.children)
				})
			}
		})

		return result
	}

	return function (obj) {
		genObj = prepareTemplate(template(obj));
		handleChildren(cacheObj, genObj, node);
	};
});
