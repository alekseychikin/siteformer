```
SFORM::migration()
  ->createTable('ingredients_complex');
```

```
SFORM::migration()
  ->addRow('ingredients', 'type ENUM("simple","complex") DEFAULT "simple" AFTER coeff_discharge');
```
