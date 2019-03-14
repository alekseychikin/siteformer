# Changing table scheme

## Add field
### As like the last one

```
ORM::alter($tablename)
  ->add(array(
    'name' => 'field_name',
    'type' => 'INT(11) UNSIGNED',
    'null' => 'NULL',
    'autoincrement' => false,
    'default' => NULL
  ))
  ->exec($alias);
```
### After some field

```
ORM::alter($tablename)
  ->addField(array(
    'name' => 'field_name',
    'type' => 'INT(11) UNSIGNED',
    'null' => 'NULL',
    'autoincrement' => false,
    'default' => NULL
  ), 'exists_field')
  ->exec($alias);
```

## Change field

```
ORM::alter($tablename)
  ->changeField('exists_change_field', array(
    'name' => 'field_name',
    'type' => 'INT(11) UNSIGNED',
    'null' => 'NULL',
    'autoincrement' => false,
    'default' => NULL
  ))
  ->exec();
```

## Drop field

```
ORM::alter($tablename)
  ->dropField('field_to_drop')
  ->exec();
```

## Method chaining

Methods `add`, `drop`, `change` return `$this`, so we can make a chain of methods and run `exec()` to commit them.

```
ORM::alter($tablename)
  ->dropField(...)
  ->changeField(...)
  ->addIndex()
  ->changeField(...)
  ->exec();
```
