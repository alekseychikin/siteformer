<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ORMDatabase.php';

class SFORMCreate extends SFORMDatabase
{
  private $sql = '';
  private $tableName;
  private $fields = array();
  private $keys = array();

  public function __construct($tableName) {
    $this->tableName = $tableName;
  }

  public function addField($field) {
    $field = $this->validateField($field);
    $this->fields[] = $field;

    return $this;
  }

  public function addKey($fields, $type = 'KEY') {
    $keyName = $fields;

    if (gettype($fields) === 'array') {
      $keyName = implode('_', $keyName);
      $fields = implode('`, `', $fields);
    }

    $fields = mb_strtoupper($type) . ' `' . $keyName .'` (`' . $fields . '`)';
    $this->keys[] = $fields;

    return $this;
  }

  public function exec($alias = 'default') {
    $sql = $this->getQuery();
    parent::query($sql, $alias);
  }

  public function getQuery() {
    $sql = 'CREATE TABLE IF NOT EXISTS `' . $this->tableName . '` (' . "\n";
    $fields = array();

    foreach ($this->fields as $field) {
      $fields[] = $this->makeStringOfField($field);
    }

    foreach ($this->keys as $key) {
      $fields[] = $key;
    }

    $sql .= implode(",\n", $fields);
    $sql .= "\n" . ') ENGINE=InnoDB DEFAULT CHARSET=utf8';

    return $sql;
  }
}
