```
SFORM::migration()
  ->createTable('ingredients_complex', array(
    'id int(11) unsigned NOT NULL AUTO_INCREMENT',
    'ingredient int(11) unsigned NOT NULL',
    'sub_ingredient int(11) unsigned NOT NULL'
  ), array(
    'primary id',
    'key ingredient',
    'key sub_ingredient'
  ));
```

```
SFORM::migration()
  ->addRow('ingredients', 'type ENUM("simple","complex") DEFAULT "simple" AFTER coeff_discharge');
```
