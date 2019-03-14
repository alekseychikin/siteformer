<?php

namespace Engine\Modules\ORM;

class ORMDelete extends ORMWhere {
  private $table;
  private $params;

  public function __construct($table) {
    $this->table = $table;
  }

  public function exec($alias = 'default') {
    return $this->execute($alias);
  }

  public function getQuery($alias = 'default') {
    $sql = 'DELETE FROM `' . $this->table . '`' . EOL;

    if ($this->getById !== false) {
      $idField = self::getPrimaryFields($this->table, $alias);
      $idField = $idField[0];
      $this->where = '`' . $this->table . '`.`' . $idField . '` = ' . $this->getById;
    }

    if ($this->where) {
      $sql .= 'WHERE ' . $this->expandExpression($this->table, $this->where) . EOL;
    }

    return $sql;
  }

  public function execute($alias = 'default') {
    $sql = $this->getQuery($alias);
    $result = parent::query($sql, $alias, true);

    return $result;
  }
}
