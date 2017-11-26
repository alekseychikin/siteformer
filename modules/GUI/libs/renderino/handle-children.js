var _hasProp = Object.prototype.hasOwnProperty;
var getDiff = require('./get-diff');
var cloneVirtualNode = require('./clone-virtual-node');
var markers = require('./markers');
var MARK_ADD = markers.MARK_ADD;
var MARK_EDIT = markers.MARK_EDIT;
var MARK_DELETE = markers.MARK_DELETE;
var MARK_NOT_MODIFIED = markers.MARK_NOT_MODIFIED;
var MARK_SKIP = markers.MARK_SKIP;

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
				if (attr !== 'hash' && attr !== 'key') {
					currNode.setAttribute(attr, elementAttrs[attr]);
				}
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

				originAttrs[attr] = void 0;
			}
		}
	}
}

module.exports = function handleChildren(cacheObj, genObj, parentNode) {
	var diff = getDiff(cacheObj, genObj);
	var newNode;
	var prevNode;
	var currNode;
	var index = 0;

	diff.forEach(function (item) {
		switch (item) {
			case MARK_ADD:
				currNode = createNode(genObj[index]);
				cacheObj.splice(index, 0, cloneVirtualNode(genObj[index]));

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

				if (typeof genObj[index] !== 'string' && typeof cacheObj[index] !== 'string') {
					handleAttrs(cacheObj[index].attrs, genObj[index].attrs, currNode);
					handleChildren(cacheObj[index].children, genObj[index].children, currNode);
				}

				prevNode = currNode;

				break;
			case MARK_NOT_MODIFIED:
				prevNode = parentNode.childNodes[index];

				if (typeof genObj[index] !== 'string') {
					handleChildren(cacheObj[index].children, genObj[index].children, prevNode);
				}

				break;
			case MARK_EDIT:
				currNode = parentNode.childNodes[index];

				var isSameType = typeof cacheObj[index] === typeof genObj[index];
				var isTwoNodes = isSameType && typeof genObj[index] !== 'string';
				var isTwoTexts = isSameType && !isTwoNodes;
				var isSameName = isTwoNodes && cacheObj[index].tag === genObj[index].tag;

				if (isSameName) {
					handleAttrs(cacheObj[index].attrs, genObj[index].attrs, currNode);
					handleChildren(cacheObj[index].children, genObj[index].children, currNode);
				} else {
					newNode = createNode(genObj[index]);
					cacheObj.splice(index, 1, cloneVirtualNode(genObj[index]));

					parentNode.insertBefore(newNode, currNode);
					parentNode.removeChild(currNode);

					if (isTwoNodes) {
						handleAttrs(cacheObj[index].attrs, genObj[index].attrs, newNode);
						handleChildren(cacheObj[index].children, genObj[index].children, newNode);
					}
				}

				prevNode = currNode;

				break;
			case MARK_DELETE:
				currNode = parentNode.childNodes[index];
				parentNode.removeChild(currNode);
				cacheObj.splice(index, 1);
				index--;

				break;
			case MARK_SKIP:
				prevNode = parentNode.childNodes[index];

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
