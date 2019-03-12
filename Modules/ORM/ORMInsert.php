<?php

namespace Engine\Modules\ORM;

class ORMInsert extends ORMDatabase {
  private $table;
  private $values;

  public function __construct($table) {
    $this->table = $table;
  }

  public function values($values) {
    $this->values = $values;

    return $this;
  }

  public function exec($alias = 'default', $getObject = false) {
    return $this->execute($alias, $getObject);
  }

  public function getQuery($alias = 'default', $getObject = false) {
    if (gettype($alias) == 'bool') {
      $getObject = $alias;
      $alias = 'default';
    }

    $sql = 'INSERT INTO `' . $this->table . '`' . EOL;
    $fields = [];
    $values = [];

    foreach ($this->values as $field => $value) {
      $fields[] = $field;

      if (gettype($value) == 'object' && method_exists($value, 'get')) {
        $value = $value->get();
      } else {
        $value = $this->quote($value);
      }

      $values[] = $value;
    }

    $sql .= '( `' . implode('`, `', $fields).'` )' . EOL;
    $sql .= 'VALUES (' . implode(', ', $values).')';

    return $sql;
  }

  public function execute($alias = 'default', $getObject = false) {
    $sql = $this->getQuery($alias, $getObject);

    parent::query($sql, $alias, true);

    if (!$getObject) {
      return $this->lastId($this->table, $alias);
    } else {
      return ORM::select()->from($this->table)->id($this->lastId($this->table, $alias))->execOne($alias);
    }
  }
}
