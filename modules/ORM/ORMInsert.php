<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ORM.php';
require_once __DIR__ . '/ORMDatabase.php';

if (!defined('N')) {
  define('N', "\n");
}

class SFORMInsert extends SFORMDatabase
{
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

    $sql = 'INSERT INTO `' . $this->table . '`' . N;
    $fields = array();
    $values = array();

    foreach ($this->values as $field => $value) {
      $fields[] = $field;

      if (gettype($value) == 'object' && method_exists($value, 'get')) {
        $value = $value->get();
      } else {
        $value = $this->quote($value);
      }

      $values[] = $value;
    }

    $sql .= '( `'.implode('`, `', $fields).'` )'.N;
    $sql .= 'VALUES ('.implode(', ', $values).')';

    return $sql;
  }

  public function execute($alias = 'default', $getObject = false) {
    $sql = $this->getQuery($alias, $getObject);

    parent::query($sql, $alias, true);

    if (!$getObject) {
      return $this->lastId($alias);
    } else {
      return SFORM::select()->from($this->table)->id($this->lastId($alias))->execOne($alias);
    }
  }
}
