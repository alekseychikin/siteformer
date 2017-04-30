<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ORMDatabase.php';

class SFORMDrop extends SFORMDatabase
{
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
