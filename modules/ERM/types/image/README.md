# Тип Изображение

## Настройки

```
[
  'storage' => 'storage', // хранилище из SFStorages
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
  $preview = SFStorages::uploadToTemp('preview');

  SFERM::createItem('places', [
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
