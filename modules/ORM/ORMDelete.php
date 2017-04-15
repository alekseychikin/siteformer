<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMDelete extends SFORMWhere
  {
    private $table;
    private $params;

    public function __construct($table)
    {
      $this->table = $table;
    }

    public function exec($alias = 'default')
    {
      return $this->execute($alias);
    }

    public function getQuery($alias = 'default')
    {
      $sql = 'DELETE FROM `'.$this->table.'`'.N;
      if ($this->getById !== false) {
        $idField = $this->getPrimaryFields($this->table, $alias);
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
      $sql = $this->getQuery($alias);
      $result = parent::query($sql, $alias, true);
      parent::updateExistsTableList();
      return $result;
    }
  }

?>
