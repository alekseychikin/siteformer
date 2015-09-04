<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMUpdate extends SFORMWhere
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

    public function exec($alias = 'default')
    {
      return $this->execute($alias);
    }

    public function getSql($alias = 'default')
    {
      $sql = 'UPDATE `'.$this->table.'`'.N.'SET ';
      $params = array();
      foreach ($this->params as $field => $value) {
        if (gettype($value) == 'object' && method_exists($value, 'get')) {
          $value = $value->get();
        }
        else {
          $value = $this->quote(SFORM::prepareWriteValue($this->table, $field, $value));
        }
        $params[] = _field_($field).' = '. $value;
      }
      $sql .= implode(', ', $params).N;
      if ($this->getById !== false) {
        $idField = $this->getPrimaryFields($alias, $this->table);
        $idField = $idField[0];
        $this->where = '`'. $this->table .'`.`'. $idField .'` = '.$this->getById;
      }
      if ($this->where) {
        $sql .= 'WHERE '.$this->expandExpression($this->table, $this->where).N;
      }
      return $sql;
    }

    public function execute($alias = 'default')
    {
      $sql = $this->getSql($alias);
      return parent::query($sql, $alias, true);
    }
  }

?>
