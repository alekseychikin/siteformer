cache = {}
template = (str, data) ->
  if !/\W/.test(str)
    fn = cache[str] = cache[str] || str
  else
    str = str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
    fn = new Function "obj", "obj=obj||{};var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('#{str}');}return p.join('');"
  if data then fn data else fn

window.count = (arr) -> arr.length

Render = (node, templateId) ->
  @node = node
  @template = template document.getElementById("template_#{templateId}").innerHTML;
  render: (obj) =>
    @node.html @template obj

module.exports = (node, templateId) ->
  Render(node, templateId)
