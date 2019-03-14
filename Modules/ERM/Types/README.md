# Тип Чекбокс

## Настройки

```
[
  'values' => [ // массив значений
    [
      'label' => 'Вариант 1', // лейбл
      'checked' => true // флаг установлен по умолчанию
    ], [
      'label' => 'Вариант 2',
      'checked' => false // флаг не установлен по умолчанию
    ]
  ]
]
```

## Добавление записи

Будет сохранен чекбокс с лейблом `Вариант 2` из примера выше:

```
ERM::createItem('places', [
  'status' => 'public',
  'user' => '666',
  'data' => [
    'checkboxes' => [2] // массив индексов, начинается с единицы
  ]
]);
```

!!! Очень важно: нумерация индексов начинается с единицы, не с нуля.

## Обновление записи

Аналогично добавлению

## Where-выражение

Значение поля — это массив индексов. Параметро сравнения для данного типа два: `all` и `any`. `all` используется по умолчанию.

### Примеры

Поиск записей, которые сожат флаг с индексами 1 и 2. Параметр сравнения опущен и используется `all`.

```
$result = ERM::getItemList('places')
  ->where('checkboxes', [1, 2])
  ->exec();
```

То же самое можно записать следующим образом:

```
$result = ERM::getItemList('places')
  ->where('checkboxes', 'all', [1, 2])
  ->exec();
```

Если нужны записи, которые содержат хотя бы один из указанных флагов, то нужно использовать `any`:

```
$result = ERM::getItemList('places')
  ->where('checkboxes', 'any', [1, 2])
  ->exec();
```


# Тип Файл

## Настройки

```
[
  'storage' => 'storage', // хранилище из Storages
  'path' => '' // дополнительный путь до папки
]
```

## Добавление записи

```
if (isset($_FILES['doc'])) {
  // сохранить картинку во временную папку из $_FILES
  // <input type="file" name="doc" />
  $doc = Storages::uploadToTemp('doc');

  ERM::createItem('places', [
    'status' => 'public',
    'user' => '666',
    'data' => [
      'doc' => $doc // передать путь
    ]
  ]);
}
```
## Обновление записи

Аналогично добавлению


# Тип Галерея

## Настройки

```
[
  'storage' => 'storage', // хранилище из Storages
  'path' => 'gallery', // дополнительный путь до папки
  'width' => 1000, // ширина большой фотки
  'height' => 1000, // высота большой фотки
  'previewWidth' => 400, // ширина превьюшки
  'previewHeight' => 300 // высота превьюшки
]
```

## Добавление записи

```
if (isset($_FILES['gallery'])) {
  // сохранить изображения во временную папку из $_FILES
  // <input type="file" name="gallery[]" multiple />
  $gallery = Storages::uploadToTemp('gallery');

  ERM::createItem('places', [
    'status' => 'public',
    'user' => '666',
    'data' => [
      'gallery' => $gallery // это массив
    ]
  ]);
}
```

## Обновление записи

```
if (isset($_FILES['gallery'])) {
  // сохранить изображения во временную папку из $_FILES
  // <input type="file" name="gallery[]" multiple />
  $gallery = Storages::uploadToTemp('gallery');

  ERM::updateItem('places', [
    'id' => 1
    'status' => 'public',
    'user' => '777',
    'data' => [
      'gallery' => [
        'add' => gallery, // массив изображений, которые нужно добавить в галерею
        'delete' => [1, 3, 5] // массив айдишников изображений из таблицы sys_type_gallery, которые нужно удалить
      ]
    ]
  ]);

  // обязательное условие для обновления галереи — это передача данных обо всех
  // элементах галереи. в противном случае будет конфликт сортировки элементов
  // 4 типа экшенов: add, skip, update, delete.
  // skip — значит нужно только обновить индекс

  ERM::updateItem('places', [
    'id' => 1
    'status' => 'public',
    'user' => '777',
    'data' => [
      'gallery' => [
        [
          'action' => 'add',
          'image' => '/path/to/image.jpg'
        ], [
          'action' => 'skip',
          'id' => 34
        ], [
          'action' => 'update',
          'id' => 36,
          'image' => '/path/to/image.jpg'
        ], [
          'action' => 'delete',
          'id' => '37'
        ]
      ]
    ]
  ]);
}
```


# Тип Изображение

## Настройки

```
[
  'storage' => 'storage', // хранилище из Storages
  'path' => '', // дополнительный путь до папки
  'width' => 400, // ширина
  'height' => 300, // высота
  'saveRatio' => true // сохранять пропорции при уменьшении
]
```

## Добавление записи

```
if (isset($_FILES['preview'])) {
  // сохранить картинку во временную папку из $_FILES
  // <input type="file" name="preview" />
  $preview = Storages::uploadToTemp('preview');

  ERM::createItem('places', [
    'status' => 'public',
    'user' => '666',
    'data' => [
      'preview' => $preview // передать путь
    ]
  ]);
}
```
## Обновление записи

Аналогично добавлению


# Тип Теги

## Where-выражение

Значение поля — это массив тегов. Параметр сравнения для данного типа два: `all` и `any`. `all` используется по умолчанию.

### Примеры

Поиск записей, которые сожат тег `пиццерия` и `суши`. Параметр сравнения опущен и используется `all`.

```
$result = ERM::getItemList('places')
  ->where('tags', ['пиццерия', 'суши'])
  ->exec();
```

То же самое можно записать следующим образом:

```
$result = ERM::getItemList('places')
  ->where('tags', 'all', ['пиццерия', 'суши'])
  ->exec();
```

Если нужны записи, которые содержат хотя бы один из указанных тегов, то нужно использовать `any`:

```
$result = ERM::getItemList('places')
  ->where('tags', 'any', ['пиццерия', 'суши'])
  ->exec();
```
