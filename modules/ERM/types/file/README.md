# Тип Файл

## Настройки

```
[
  'storage' => 'storage', // хранилище из SFStorages
  'path' => '' // дополнительный путь до папки
]
```

## Добавление записи

```
if (isset($_FILES['doc'])) {
  // сохранить картинку во временную папку из $_FILES
  // <input type="file" name="doc" />
  $doc = SFStorages::uploadToTemp('doc');

  SFERM::createItem('places', [
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
