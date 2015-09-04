# SFORM

## Insert

```
SFORM::insert($tablename)->values(array(
  'field' => 'value'
))->execute();
```

## Update

```
SFORM::update($tablename)->values(array(
  'field' => 'value'
  ))
  ->where($where)
  ->exec();
```

Если нужно обновить элемент с известным `id`, то можно вызвать соответствующий метод
```
SFORM::update($tablename)->values(array(
  'field' => 'value'
  ))
  ->id($id)
  ->exec();
```
