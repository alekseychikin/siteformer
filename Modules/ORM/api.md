# ORM

## Insert

```
ORM::insert($tablename)->values(array(
  'field' => 'value'
))->execute();
```

## Update

```
ORM::update($tablename)->values(array(
  'field' => 'value'
  ))
  ->where($where)
  ->exec();
```

Если нужно обновить элемент с известным `id`, то можно вызвать соответствующий метод
```
ORM::update($tablename)->values(array(
  'field' => 'value'
  ))
  ->id($id)
  ->exec();
```
