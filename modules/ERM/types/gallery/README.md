# Тип Галерея

## Настройки

```
[
  'storage' => 'storage', // хранилище из SFStorages
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
  $gallery = SFStorages::uploadToTemp('gallery');

  SFERM::createItem('places', [
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
  $gallery = SFStorages::uploadToTemp('gallery');

  SFERM::updateItem('places', [
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

  SFERM::updateItem('places', [
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
