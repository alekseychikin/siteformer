# Модификаторы

## Модификатор на запись.

Параметры: `Таблица`, `поле`, `колбэк`
```
SFORM::addWriteModifier('users', 'password', function ($value)
{
  return md5($value);
});
```

## Модификатор на чтение.

Параметры те же. Вторым параметром можно создавать новые поля с альтернативными значениями без изменения исходного. Если параметр строка — то изменится оригинальное значение

Пример с новым полем.

```
SFORM::addReadModifier('users', array('glovessize' => 'glovessize_'), function ($value)
{
  return str_replace('_', '/', $value);
});
```

Пример с изменением оригинального.

```
SFORM::addReadModifier('users', 'glovessize', function ($value)
{
  return str_replace('_', '/', $value);
});
```
