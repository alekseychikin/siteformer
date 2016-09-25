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
        if (key === 'childs') continue;
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

  function cloneNodeObject(obj, cachedElements) {
    var attr, copy, elem, i, j, len;

    if (typeof cachedElements === 'undefined') {
      cachedElements = [];
    }

    copy = null;

    if (null === obj || "object" !== typeof obj) {
      return obj;
    }

    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());

      obj = null;
      cachedElements = null;

      return copy;
    }

    if ((cachedElements.indexOf(obj)) === -1) {
      cachedElements.push(obj);

      if (obj instanceof Array) {
        copy = [];

        for (i = j = 0, len = obj.length; j < len; i = ++j) {
          elem = obj[i];

          if (i !== 'childs' && i !== 'attrs') {
            copy[i] = cloneNodeObject(elem, cachedElements);
          }
        }

        obj = null;
        cachedElements = null;

        return copy;
      }

      if (obj instanceof Object) {
        copy = {};

        for (i in obj) {
          attr = obj[i];

          if (i !== 'childs' && i !== 'attrs') {
            copy[i] = cloneNodeObject(attr, cachedElements);
          }
        }

        obj = null;
        cachedElements = null;

        return copy;
      }
    } else {
      obj = null;
      cachedElements = null;

      return obj;
    }
  }

  function getNodeByObject(obj) {
    var i, len;

    for (i = 0, len = nodeObjects.length; i < len; i++) {
      if (nodeObjects[i].obj === obj) {
        if (!nodeObjects[i].node) {
          debugger;
        }

        return nodeObjects[i].node;
      }
    }

    debugger;

    return false;
  }

  function rememberNodeByObject(obj, node) {
    var i, len;

    for (i = 0, len = nodeObjects.length; i < len; i++) {
      if (nodeObjects[i].obj === obj) {
        nodeObjects[i].node = node;

        return true;
      }
    }

    nodeObjects.push({
      obj: obj,
      node: node
    });

    return true;
  }

  function forgotNode(node) {
    var i, len;

    for (i = 0, len = nodeObjects.length; i < len; i++) {
      if (nodeObjects[i].node === node) {
        nodeObjects.splice(i, 1);

        node = null;

        return true;
      }
    }
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

  function generateObjectByNode(childs) {
    var obj = [];
    var nodeObj;
    var value;
    var child;

    for (child in childs) {
      if (_hasProp.call(childs, child)) {
        child = childs[child];

        switch (child.nodeType) {
          case 3: // text node
            value = child.nodeValue;
            nodeObj = {
              type: 'text',
              text: value
            };
            break;
          case 1: // tag
            nodeObj = {
              type: 'node',
              name: child.nodeName.toLowerCase(),
              attrs: getAttributes(child),
              childs: generateObjectByNode(child.childNodes)
            };
            break;
        }

        obj.push(nodeObj);
        rememberNodeByObject(nodeObj, child);
      }
    }

    childs = null;
    nodeObj = null;
    value = null;
    child = null;

    return obj;
  }

  var cacheObj = generateObjectByNode(node.childNodes);

  var genObj;

  function handleChilds(cacheObj, genObj, parentNode) {
    var diffResult = arrDifference(cacheObj, genObj);
    var prevNode;
    var currNode;
    var newNode;
    var index = 0;

    // console.group();

    diffResult.forEach(function (item) {
      switch (item.mark) {
        case 'add':
          newNode = createNode(item.element);
          cacheObj.splice(index, 0, cloneNodeObject(item.element));

          rememberNodeByObject(cacheObj[index], newNode);

          if (prevNode) {
            if (prevNode.nextSibling) {
              parentNode.insertBefore(newNode, prevNode.nextSibling);
            } else {
              parentNode.appendChild(newNode);
            }
          } else {
            if (parentNode.firstChild) {
              parentNode.insertBefore(newNode, parentNode.firstChild);
            } else {
              parentNode.appendChild(newNode);
            }
          }

          prevNode = newNode;

          if (item.element.type === 'node') {
            cacheObj[index].attrs = {};
            cacheObj[index].childs = [];

            handleAttrs(cacheObj[index].attrs, item.element.attrs, newNode);

            handleChilds(cacheObj[index].childs, item.element.childs, newNode);
          }

          newNode = null;

          break;
        case 'skip':
          if (item.origin !== cacheObj[index]) {
            debugger;
          }

          prevNode = getNodeByObject(item.origin);

          if (item.element.type === 'node') {
            handleChilds(item.origin.childs, item.element.childs, prevNode);
          }

          break;
        case 'edit':
          currNode = getNodeByObject(item.origin);

          if (item.origin !== cacheObj[index]) {
            debugger;
          }

          var isSameType = item.origin.type === item.element.type;
          var isSameName = item.origin.type === 'node' && item.origin.name === item.element.name;
          var isTwoNodes = item.element.type === 'node' && isSameType;

          // two nodes with different name
          // two texts
          if (!isSameType || !isSameName) {
            newNode = createNode(item.element);

            if (isTwoNodes) {
              moveChilds(currNode, newNode);
            }

            parentNode.insertBefore(newNode, currNode);
            parentNode.removeChild(currNode);

            forgotNode(currNode);
            rememberNodeByObject(item.origin, newNode);

            if (item.element.type === 'text') {
              item.origin.text = item.element.text;
              delete item.origin.attrs;
              delete item.origin.childs;
              delete item.origin.name;
            } else {
              delete item.origin.text;

              if (!isTwoNodes) {
                item.origin.attrs = {};
                item.origin.childs = [];
              }

              if (~singleTags.indexOf(item.element.name)) {
                item.origin.childs.splice(0);
                item.element.childs.splice(0);
              }

              item.origin.name = item.element.name;

              handleAttrs(item.origin.attrs, item.element.attrs, newNode);

              handleChilds(item.origin.childs, item.element.childs, newNode);
            }

            item.origin.type = item.element.type;

            currNode = newNode;
            newNode = null;
          } else {
            try {
              handleAttrs(item.origin.attrs, item.element.attrs, currNode);
            } catch(e) {
              console.error(e);
              debugger;
            }
            handleChilds(item.origin.childs, item.element.childs, currNode);
          }

          prevNode = currNode;
          break;
        case 'delete':
          currNode = getNodeByObject(item.element);

          try {
            parentNode.removeChild(currNode);
          } catch (e) {
            console.error(e)
            debugger;
          }

          forgotNode(currNode);

          cacheObj.splice(index, 1);

          index--;

          break;
      }
      index++;
    });

    cacheObj = null;
    genObj = null;
    parentNode = null;
    diffResult = null;
    currNode = null;

    // console.groupEnd();
  }

  function moveChilds(sourceNode, destNode) {
    var childs = sourceNode.childNodes;
    var child = 0;

    if (!~singleTags.indexOf(destNode.nodeName.toLowerCase())) {
      while (childs.length) {
        destNode.appendChild(childs[0]);
      }
    } else {
      for (child = 0; child < childs.length; child++) {
        if (_hasProp.call(childs, child)) {
          forgotNode(childs[child]);
        }
      }
    }

    child = null;
    childs = null;
  }

  function createNode(item) {
    switch (item.type) {
      case 'node':
        return document.createElement(item.name);
      case 'text':
        return document.createTextNode(item.text);
    }
  }

  var logicAttrs = ['readonly', 'selected', 'checked', 'disabled', 'autofocus', 'required', 'multiple', 'autoplay', 'controls', 'loop', 'muted'];

  function handleAttrs(originAttrs, elementAttrs, currNode) {
    var attr;

    for (attr in elementAttrs) {
      if (_hasProp.call(elementAttrs, attr)) {
        if (~logicAttrs.indexOf(attr)) {
          currNode[attr] = true;
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

  return function (obj) {
    genObj = template(obj);
    handleChilds(cacheObj, genObj, node);
  };
});
