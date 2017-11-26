var simpleTypes = ['string', 'boolean', 'number'];
var _hasProp = Object.prototype.hasOwnProperty;

var markers = require('./markers');
var MARK_ADD = markers.MARK_ADD;
var MARK_EDIT = markers.MARK_EDIT;
var MARK_DELETE = markers.MARK_DELETE;
var MARK_NOT_MODIFIED = markers.MARK_NOT_MODIFIED;
var MARK_SKIP = markers.MARK_SKIP;

function isEqual (sourceA, sourceB) {
	if (typeof sourceA !== typeof sourceB) return false;

	if (typeof sourceA !== 'object' && typeof sourceB !== 'object') return sourceA === sourceB;

	// each fields of source array and check them at dest array
	// if it not exists or not equals then return false
	if (!isEqualArraysForeach(sourceA, sourceB)) return false;

	// if everything fine return true
	// arrays are equals
	return true;
};

function isEqualArraysForeach (sourceA, sourceB) {
	var key, value;
	var keys = [];

	for (key in sourceA) {
		if (_hasProp.call(sourceA, key)) {
			if (key === 'children') continue;

			keys.push(key);

			if (typeof sourceB[key] === 'undefined') {
				sourceA = null;
				sourceB = null;

				return false;
			}

			value = sourceA[key];

			if (simpleTypes.indexOf(typeof value) !== -1) {
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

	for (key in sourceB) {
		if (_hasProp.call(sourceB, key)) {
			if (key === 'children') continue;

			if (~keys.indexOf(key)) continue;

			if (typeof sourceA[key] === 'undefined') return false;

			value = sourceB[key];

			if (simpleTypes.indexOf(typeof value) !== -1) {
				if (value !== sourceA[key]) return false;
			} else {
				var diffResult = isEqual(value, sourceA[key]);

				if (!diffResult) return false;
			}
		}
	}

	return true;
};

function isSameHash(sourceA, sourceB) {
	if (sourceA.attrs && sourceA.attrs.hash && sourceB.attrs && sourceB.attrs.hash) {
		return sourceA.attrs.hash === sourceB.attrs.hash;
	}

	return false
}

function putBufferElementsInRes (res, buffer, source, dest) {
	var i, j, len;

	for (i = 0, len = Math.min(buffer.indexesALength, buffer.indexesBLength); i < len; i++) {
		res.push(MARK_EDIT);
	}

	if (buffer.indexesALength > buffer.indexesBLength) {
		for (j = i; j < buffer.indexesALength; j++) {
			res.push(MARK_DELETE);
		}
	} else {
		for (j = i; j < buffer.indexesBLength; j++) {
			res.push(MARK_ADD);
		}
	}

	for (i = 0, len = Math.max(buffer.indexesALength, buffer.indexesBLength); i < len; i++) {
		// buffer.indexesA[i] = void 0;
		// buffer.indexesB[i] = void 0;
	}

	buffer.indexesALength = 0;
	buffer.indexesBLength = 0;
};

function findSourceIndexInBuffer (indexes, length, elements, srcElement) {
	var i = 0;

	for (; i < length; i++) {
		if (isSameHash(elements[indexes[i]], srcElement)) {
			return {
				mark: MARK_SKIP,
				index: i
			};
		}

		if (isEqual(elements[indexes[i]], srcElement)) {
			return {
				mark: MARK_NOT_MODIFIED,
				index: i
			};
		}
	}

	return false;
};

function collectElements (res, buffer, source, dest) {
	if (buffer.indexesALength === buffer.limit || buffer.indexesBLength === buffer.limit) {
		putBufferElementsInRes(res, buffer, source, dest);
	}
}

function Buffer(limit) {
	this.limit = limit;
	this.indexesA = new Array(limit);
	this.indexesALength = 0;
	this.indexesB = new Array(limit);
	this.indexesBLength = 0;
}

Buffer.prototype.pushIndexB = function (index) {
	this.indexesB[this.indexesBLength++] = index;
}

Buffer.prototype.pushIndexA = function (index) {
	this.indexesA[this.indexesALength++] = index;
}

Buffer.prototype.clearIndexesBFromFindedIndex = function (index) {
	var i;
	for (i = index; i < this.indexesBLength; i++) {
		this.indexesB[i] = void 0;
	}

	this.indexesBLength -= this.indexesBLength - index;
}

Buffer.prototype.clearIndexesAFromFindedIndex = function (index) {
	var i;
	for (i = index; i < this.indexesALength; i++) {
		this.indexesA[i] = void 0;
	}

	this.indexesALength -= this.indexesALength - index;
}

module.exports = function getDiff (source, dest) {
	var i, len;
	var res = [];
	var indexA = 0; // for source
	var indexB = 0; // for dest
	var findedIndexA;
	var findedIndexB;
	var maxArrLength = Math.max(source.length, dest.length);
	var bufferLimit = 20;
	var buffer = new Buffer(bufferLimit);

	if (!source.length) {
		for (; indexB < dest.length; indexB++) {
			buffer.pushIndexB(indexB);

			collectElements(res, buffer, source, dest);
		}
	} else {
		while (indexA < source.length) {
			if (indexB < dest.length) {
				if (isSameHash(source[indexA], dest[indexB])) {
					putBufferElementsInRes(res, buffer, source, dest);

					res.push(MARK_SKIP);
				} else if (isEqual(source[indexA], dest[indexB])) {
					putBufferElementsInRes(res, buffer, source, dest);

					res.push(MARK_NOT_MODIFIED);
				} else {
					findedIndexB = findSourceIndexInBuffer(buffer.indexesB, buffer.indexesBLength, dest, source[indexA]);
					findedIndexA = findSourceIndexInBuffer(buffer.indexesA, buffer.indexesALength, source, dest[indexB]);

					if (findedIndexB !== false) {
						indexB = buffer.indexesB[findedIndexB.index];

						buffer.clearIndexesBFromFindedIndex(findedIndexB.index);

						putBufferElementsInRes(res, buffer, source, dest);

						res.push(findedIndexB.mark);
					} else if (findedIndexA !== false) {
						indexA = buffer.indexesA[findedIndexA.index];

						buffer.clearIndexesAFromFindedIndex(findedIndexA.index);

						putBufferElementsInRes(res, buffer, source, dest);

						res.push(findedIndexA.mark);
					} else {
						buffer.pushIndexA(indexA);
						buffer.pushIndexB(indexB);
					}
				}

				indexA++;
				indexB++;
			}

			if (indexA >= source.length || indexB >= dest.length) {
				for (; indexA < source.length; indexA++) {
					findedIndexB = findSourceIndexInBuffer(buffer.indexesB, buffer.indexesBLength, dest, source[indexA]);

					if (findedIndexB !== false) {
						indexB = buffer.indexesB[findedIndexB.index];

						buffer.clearIndexesBFromFindedIndex(findedIndexB.index);

						putBufferElementsInRes(res, buffer, source, dest);

						res.push(findedIndexB.mark);
						indexA++;
						indexB++;

						collectElements(res, buffer, source, dest);

						break;
					} else {
						buffer.pushIndexA(indexA);
					}
				}

				for (; indexB < dest.length; indexB++) {
					findedIndexA = findSourceIndexInBuffer(buffer.indexesA, buffer.indexesALength, source, dest[indexB]);

					if (findedIndexA !== false) {
						indexA = buffer.indexesA[findedIndexA.index];

						buffer.clearIndexesAFromFindedIndex(findedIndexA.index);

						putBufferElementsInRes(res, buffer, source, dest);

						res.push(findedIndexA.mark);
						indexA++;
						indexB++;

						collectElements(res, buffer, source, dest);

						break;
					} else {
						buffer.pushIndexB(indexB);
					}
				}
			}

			collectElements(res, buffer, source, dest);
		}
	}

	putBufferElementsInRes(res, buffer, source, dest);

	buffer = null;
	source = null;
	dest = null;

	return res;
};
