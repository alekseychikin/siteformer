# Changing table scheme

## Add field
### As like the last one

```
SFORM::alter($tablename)
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
SFORM::alter($tablename)
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
SFORM::alter($tablename)
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
SFORM::alter($tablename)
  ->dropField('field_to_drop')
  ->exec();
```

## Method chaining

Methods `add`, `drop`, `change` return `$this`, so we can make a chain of methods and run `exec()` to commit them.

```
SFORM::alter($tablename)
  ->dropField(...)
  ->changeField(...)
  ->addIndex()
  ->changeField(...)
  ->exec();
```
