module.exports = function cloneVirtualNode(node) {
  return typeof node === 'string' ? node : {tag: node.tag, attrs: {}, children: []};
}
