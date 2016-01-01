(function (factory)
{
  window.count = function (arr)
  {
    return arr.length;
  };
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory;
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('render', [], factory);
  }
  else {
    window.render = factory;
  }
})(function (handleFn, node)
{
  var _hasProp = Object.prototype.hasOwnProperty;
  var nodeObjects = [];

  function cloneObject(obj, cachedElements)
  {
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
      return copy;
    }
    if ((cachedElements.indexOf(obj)) === -1) {
      cachedElements.push(obj);
      if (obj instanceof Array) {
        copy = [];
        for (i = j = 0, len = obj.length; j < len; i = ++j) {
          elem = obj[i];
          copy[i] = cloneObject(elem, cachedElements);
        }
        return copy;
      }
      if (obj instanceof Object) {
        copy = {};
        for (i in obj) {
          attr = obj[i];
          copy[i] = cloneObject(attr, cachedElements);
        }
        return copy;
      }
    }
    else {
      return obj;
    }
  }

  function isEqualArrays(sourceA, sourceB)
  {
    // each fields of source array and check them at dest array
    // if it not exists or not equals then return false
    if (!isEqualArraysForeach(sourceA, sourceB)) return false;

    // do the same thing with dest array
    // if dest field not exists in source array
    // or not empty then return false
    if (!isEqualArraysForeach(sourceB, sourceA)) return false;

    // if everything fine return true
    // arrays are equals
    return true;
  }

  function isEqualArraysForeach(sourceA, sourceB)
  {
    var key, value;
    for (key in sourceA) {
      if (_hasProp.call(sourceA, key)) {
        if (key === 'childs') continue;
        if (typeof sourceB[key] === 'undefined') return false;
        value = sourceA[key];
        if (['string', 'boolean', 'number'].indexOf(typeof value) !== -1) {
          if (value !== sourceB[key]) return false;
        }
        else {
          var diffResult = isEqualArrays(value, sourceB[key]);
          if (!diffResult) return false;
        }
      }
    }
    return true;
  }

  var arrDifference = (function ()
  {
    var res;
    var indexA;
    var indexB;
    var buffer;
    var _hasProp = Object.prototype.hasOwnProperty;
    var i;

    function putElementInResWithMark(res, element, mark, origin)
    {
      element = {
        mark: mark,
        element: element
      };
      if (typeof origin !== 'undefined') {
        element.origin = origin;
      }
      res.push(element);
    }

    function putBufferElementsInRes(buffer, res, index, source)
    {
      if (index < 0) {
        index = -index - 1;
        for (i = 0; i < index; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'edit', source[buffer.indexesB[i]]);
        }
        for (i = index; i < buffer.indexesA.length; i++) {
          putElementInResWithMark(res, source[buffer.indexesA[i]], 'delete');
        }
      }
      else {
        for (i = 0; i < index; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'edit', source[buffer.indexesA[i]]);
        }
        for (i = index; i < buffer.elements.length; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'add');
        }
        for (i = buffer.elements.length; i < buffer.indexesA.length; i++) {
          putElementInResWithMark(res, source[buffer.indexesA[i]], 'delete');
        }
      }
      buffer.indexesA.splice(0);
      buffer.indexesB.splice(0);
      buffer.elements.splice(0);
    }

    function findSourceIndexInBuffer(indexes, elements, srcElement)
    {
      for (i = 0; i < indexes.length; i++) {
        if (isEqualArrays(elements[indexes[i]], srcElement)) {
          return i;
        }
      }
      return false;
    }

    return function (source, dest)
    {
      dest || (dest = []);
      res = [];
      indexA = 0;
      indexB = 0;
      buffer = {
        indexesA: [],
        indexesB: [],
        elements: []
      };
      if (!source.length) {
        for (indexB = 0; indexB < dest.length; indexB++) {
          putElementInResWithMark(res, dest[indexB], 'add');
        }
      }
      for (indexA = 0; indexA < source.length; indexA++) {
        if (typeof dest[indexB] === 'undefined') {
          // it seems that size array of source is bigger than size array of dest
          // so mark current source item as delete
          if (buffer.indexesA.length) {
            findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);
            if (findedIndexB !== false) {
              indexB = buffer.indexesB[findedIndexB];
              putBufferElementsInRes(buffer, res, -findedIndexB - 1, source);
              putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
            }
            else {
              buffer.indexesA.push(indexA);
            }
          }
          else {
            putElementInResWithMark(res, source[indexA], 'delete');
          }
        }
        else {
          // elements are not equal
          if (!isEqualArrays(source[indexA], dest[indexB])) {
            // and buffer is empty
            if (!buffer.indexesA.length) {
              // create buffer with index and element of dest
              buffer.indexesA.splice(0);
              buffer.indexesB.splice(0);
              buffer.elements.splice(0);
              buffer.indexesA.push(indexA);
              buffer.indexesB.push(indexB);
              buffer.elements.push(dest[indexB]);
            }
            // buffer is not empty
            else {
              // if element of dest is equal already skiped element of source
              // find index and mark the number of elements like edit
              // and mark other elements like add
              findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);
              findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);
              if (findedIndexA !== false) {
                indexA = buffer.indexesA[findedIndexA];
                putBufferElementsInRes(buffer, res, findedIndexA, source);
                putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
              }
              else if (findedIndexB !== false) {
                indexB = buffer.indexesB[findedIndexB];
                indexA = indexA;
                putBufferElementsInRes(buffer, res, -findedIndexB - 1, source);
                putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
              }
              // if index not found
              // add dest element to buffer element
              else {
                buffer.indexesA.push(indexA);
                buffer.indexesB.push(indexB);
                buffer.elements.push(dest[indexB]);
              }
            }
          }
          // elements are equal
          // check buffer and do something with it
          else {
            // buffer is not empty and equal elements gets
            // mark buffer elements as edit
            if (buffer.indexesA.length) {
              putBufferElementsInRes(buffer, res, buffer.indexesA.length, source);
            }
            putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
          }
        }
        indexB++;
        if (indexA === source.length - 1) {
          // elements of source are fetched
          // but elements of dest still exists
          // because size array of dest is bigger than size array of source
          findedIndexA = false;
          if (indexB < dest.length) {
            // create empty buffer
            if (!buffer.elements.length) {
              buffer.indexesA.splice(0);
              buffer.indexesB.splice(0);
              buffer.elements.splice(0);
            }
            // append rest of elements of dest to buffer
            for (; indexB < dest.length; indexB++) {
              findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);
              if (findedIndexA !== false) {
                break;
              }
              else {
                buffer.elements.push(dest[indexB]);
              }
            }
          }
          // append buffer elements to res
          // if not found equal element at sources
          if (buffer.elements.length) {
            // if equal element found in sources
            if (findedIndexA !== false) {
              // do this loop one more time
              indexA = buffer.indexesA[findedIndexA] - 1;
              putBufferElementsInRes(buffer, res, findedIndexA, source);
            }
            else {
              putBufferElementsInRes(buffer, res, buffer.indexesB.length, source);
            }
          }
        }
      }
      return res;
    };
  })();

  function getNodeByObject(obj)
  {
    var i, len;
    for (i = 0, len = nodeObjects.length; i < len; i++) {
      if (nodeObjects[i].obj === obj) return nodeObjects[i].node;
    }
    return false;
  }

  function rememberNodeByObject(obj, node)
  {
    if (!getNodeByObject(obj)) {
      nodeObjects.push({
        obj: obj,
        node: node
      });
    }
    else {
      for (i = 0, len = nodeObjects.length; i < len; i++) {
        if (nodeObjects[i].obj === obj) {
          nodeObjects[i].node = node;
          return true;
        }
      }
    }
    return true;
  }

  function getAttributes(node)
  {
    var attrs = [];
    var attrName;
    for (attrName in node.attributes) if (_hasProp.call(node.attributes, attrName)) {
      attrName = node.attributes[attrName].name;
      attrs.push({
        name: attrName,
        value: node.getAttribute(attrName)
      });
    }
    return attrs;
  }

  function generateObjectByNode(node)
  {
    var obj = [];
    var nodeObj;
    var childs = node.childNodes;
    var value;
    var child;
    for (child in childs) if (_hasProp.call(childs, child)) {
      child = childs[child];
      switch (child.nodeType) {
        case 3: // text node
          value = child.nodeValue;
          if (!value.trim().length) {
            continue;
          }
          nodeObj = {
            type: 'text',
            text: value
          };
          obj.push(nodeObj);
          rememberNodeByObject(nodeObj, child);
          break;
        case 1: // tag
          nodeObj = {
            attrs: getAttributes(child),
            name: child.nodeName.toLowerCase(),
            childs: generateObjectByNode(child),
            type: 'node'
          };
          obj.push(nodeObj);
          rememberNodeByObject(nodeObj, child);
      }
    }
    return obj;
  }

  var cacheObj = generateObjectByNode(node);

  var genObj;

  var singleTags = ['hr', 'br', 'base', 'col', 'embed', 'img', 'area', 'source', 'track', 'input', '!DOCTYPE', 'link', 'meta'];

  function handleChilds(genObj, cacheObj, parentNode)
  {
    var diffResult = arrDifference(cacheObj, genObj);
    var prevNode;
    var currNode;
    var newNode;
    var diffAttrs;
    var index = 0;
    var childs;
    var attrs;
    diffResult.forEach(function (item)
    {
      switch (item.mark) {
        case 'add':
          // console.log('add');
          newNode = createNode(item.element);
          cacheObj.splice(index, 0, cloneObject(item.element));
          rememberNodeByObject(cacheObj[index], newNode);
          if (item.element.type === 'node') {
            if (!cacheObj[index].attrs) cacheObj[index].attrs = [];
            cacheObj[index].attrs.splice(0);
            handleAttrs(item.element.attrs, cacheObj[index].attrs, newNode);
          }
          if (prevNode) {
            if (prevNode.nextSibling) {
              parentNode.insertBefore(newNode, prevNode.nextSibling);
            }
            else {
              parentNode.appendChild(newNode);
            }
          }
          else {
            if (parentNode.firstChild) {
              parentNode.insertBefore(newNode, parentNode.firstChild);
            }
            else {
              parentNode.appendChild(newNode);
            }
          }
          prevNode = newNode;
          if (item.element.type === 'node') {
            cacheObj[index].childs = [];
            handleChilds(item.element.childs, cacheObj[index].childs, newNode);
          }
          break;
        case 'skip':
          // console.log('skip');
          prevNode = getNodeByObject(item.origin);
          if (item.element.type === 'node') {
            handleChilds(item.element.childs, cacheObj[index].childs, prevNode);
          }
          break;
        case 'edit':
          // console.log('edit');
          currNode = getNodeByObject(item.origin);
          if (
            item.origin.type !== item.element.type ||
            item.origin.name !== item.element.name ||
            (item.origin.type === 'text' && item.origin.type === item.element.type)
          ) {
            // create a new node
            newNode = createNode(item.element);

            // move all childs to new node
            if (item.origin.type === 'node' && item.element.type === 'node') {
              moveChilds(currNode, newNode);
            }

            // add to DOM a new Node
            parentNode.insertBefore(newNode, currNode);

            // remove an old Node
            parentNode.removeChild(currNode);
            currNode = newNode;

            childs = cacheObj[index].childs;
            cacheObj[index] = cloneObject(item.element);
            cacheObj[index].childs = childs;

            // save link to node from object
            rememberNodeByObject(cacheObj[index], currNode);

            attrs = cacheObj[index].attrs || [];
            attrs.splice(0);
            if (item.element.type === 'node'){
              if (!item.element.attrs) item.element.attrs = [];
              handleAttrs(item.element.attrs, attrs, currNode);
            }

            if (typeof cacheObj[index].childs === 'undefined') {
              cacheObj[index].childs = [];
            }
            handleChilds(item.element.childs, cacheObj[index].childs, currNode);

            newNode = null;
          }
          else

          // change attrs at curr node
          if (item.element.type === 'node') {
            attrs = cacheObj[index].attrs || [];
            handleAttrs(item.element.attrs, attrs, currNode);

            childs = cacheObj[index].childs || [];
            handleChilds(item.element.childs, childs, currNode);
          }

          prevNode = currNode;
          break;
        case 'delete':
          // console.log('delete');
          currNode = getNodeByObject(item.element);
          parentNode.removeChild(currNode);
          cacheObj.splice(index, 1);
          index--;
          break;
      }
      index++;
    });
  }

  function moveChilds(sourceNode, destNode)
  {
    var childs = sourceNode.childNodes;
    var child;
    while (childs.length)  {
      for (child in childs) if (_hasProp.call(childs, child)) {
        destNode.appendChild(childs[child]);
        break;
      }
    }
    child = null;
    childs = null;
  }

  function createNode(item)
  {
    switch (item.type) {
      case 'node':
        return document.createElement(item.name);
      case 'text':
        return document.createTextNode(item.text);
    }
  }

  function sortAttrs(a, b)
  {
    return a.name > b.name;
  }

  function handleAttrsPrepare(attrs)
  {
    var obj = {};
    attrs.forEach(function (item)
    {
      obj[item.name] = item.value;
    });
    return obj;
  }

  var logicAttrs = ['readonly', 'selected', 'checked', 'disabled', 'autofocus', 'required', 'multiple', 'autoplay', 'controls', 'loop', 'muted'];

  function handleAttrs(elementAttrs, originAttrs, currNode)
  {
    var destAttrs = handleAttrsPrepare(elementAttrs);
    var sourceAttrs = handleAttrsPrepare(originAttrs);
    originAttrs.splice(0);
    var attr;
    for (attr in destAttrs) {
      if (_hasProp.call(destAttrs, attr)) {
        if (logicAttrs.indexOf(attr) !== -1) {
          currNode[attr] = true;
        }
        else if (attr === 'value') {
          if (currNode.nodeName.toLowerCase() === 'option') {
            currNode.setAttribute('value', destAttrs[attr]);
          }
          else if (currNode.value != destAttrs[attr]) {
            currNode.value = destAttrs[attr];
          }
        }
        else {
          currNode.setAttribute(attr, destAttrs[attr]);
        }
        originAttrs.push({
          name: attr,
          value: destAttrs[attr]
        });
      }
    }
    for (attr in sourceAttrs) {
      if (_hasProp.call(sourceAttrs, attr)) {
        if (!destAttrs[attr]) {
          if (logicAttrs.indexOf(attr) !== -1) {
            currNode[attr] = false;
          }
          else if (attr === 'value') {
            currNode.value = '';
          }
          else {
            currNode.removeAttribute(attr);
          }
        }
      }
    }
    destAttrs = null;
    sourceAttrs = null;
  }

  return function (obj)
  {
    genObj = handleFn(obj);
    handleChilds(genObj, cacheObj, node);
  };
});
