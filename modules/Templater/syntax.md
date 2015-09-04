Прямой обход массива
```
{% for variable in array %}
...
{% endfor %}
```
Если нужен индекс, то используется следующий синтаксис
```
{% for index, variable in array %}
...
{% endfor %}
```

Обратный обход массива
```
{% for variable revertin array %}
...
{% endfor %}
```

Включить подшаблон
```
{% include 'path/from/templates/' %}
```

Условия
```
{% if expression %}
...
{% else %}
...
{% endif %}
```

Вывести переменную
```
{{ variable }}
```

Вывести переменную с экранировкой хтмл-тэгов
```
{{~ variable }}
```
Если нужно вывести элемент массива, например `$arr['param1'][$paramvar]['param2']`
```
{{ arr.param1[paramvar].param2 }}
```

Проверить переменную на существование
```
{% if ?variable %}
```
Это трансформируется в
```
if ( (isset(variable) && !empty(variable)) ) {
```

Доступ к элементам массива
```
{% for user in users %}
  <div>{{ user.fullname }}</div>
{% endfor %}
```
Подключить скрипт на страницу
```
{% require_js 'path-to-js' data-attribute="this is data-attributes" %}
```
Подключить цсс на страницу
```
{% require_css 'path-to-css' %}
```
Подключить шаблон на страницу
```
{% require_template 'path to template' item='user' data-attribute="its data-attribute" %}
```
Если в пхп-шаблонах выводится переменная `user.fullname`, как элемент массива значений, то
в джс-шаблонах `user` не участвует. Там мы передаём объект `{fullname: 'Chikin'}`.
Указывая `item='user'`, в джс-шаблоны пойдёт только нужная часть.

Когда мы делаем подключение стилей, скриптов или шаблонов, они добавляются в специальный массив,
а вот на страницу подключаются с помощью переменных
```
{{ css_includes }}
{{ js_includes }}
{{ template_includes }}
```
