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
	var generateObjectByNode = require('./generate-object-by-node');
	var handleChildren = require('./handle-children');
	var prepareTemplate = require('./prepare-template');

	var cacheObj = generateObjectByNode(node.childNodes);

	return function (obj) {
		try {
			var genObj = template(obj);
			genObj = prepareTemplate(genObj);
			handleChildren(cacheObj, genObj, node);
		} catch (e) {
			console.error(e)
		}
	};
});
