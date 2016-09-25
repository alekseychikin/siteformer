<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMInsert extends SFORMDatabase
  {
    private $table;
    private $params;

    public function __construct($table)
    {
      $this->table = $table;
    }

    public function values($params)
    {
      $this->params = $params;
      return $this;
    }

    public function exec($alias = 'default', $getObject = false)
    {
      return $this->execute($alias, $getObject);
    }

    public function getQuery($alias = 'default', $getObject = false)
    {
      if (gettype($alias) == 'bool') {
        $getObject = $alias;
        $alias = 'default';
      }
      $sql = 'INSERT INTO '.$this->table.N;
      $fields = array();
      $values = array();
      foreach ($this->params as $field => $value) {
        $fields[] = $field;
        if (gettype($value) == 'object' && method_exists($value, 'get')) {
          $value = $value->get();
        }
        else {
          $value = $this->quote(SFORM::prepareWriteValue($this->table, $field, $value));
        }
        $values[] = $value;
      }
      $sql .= '( `'.implode('`, `', $fields).'` )'.N;
      $sql .= 'VALUES ('.implode(', ', $values).')';
      return $sql;
    }

    public function execute($alias = 'default', $getObject = false)
    {
      $sql = $this->getQuery($alias, $getObject);
      parent::query($sql, $alias, true);
      if (!$getObject) {
        return $this->lastId($alias);
      }
      else {
        return SFORM::select()->from($this->table)->id($this->lastId($alias))->execOne($alias);
      }
    }
  }

?>
