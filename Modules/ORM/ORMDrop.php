<?php

namespace Engine\Modules\ORM;

class ORMDrop extends ORMDatabase {
  private $sql = '';
  private $tableName;

  public function __construct($tableName) {
    $this->tableName = $tableName;
  }

  public function exec($alias = 'default') {
    $sql = $this->getQuery();
    parent::query($sql, $alias);
    parent::updateExistsTableList();
  }

  public function getQuery() {
    $sql = 'DROP TABLE IF EXISTS `' . $this->tableName . '`';

    return $sql;
  }
}
