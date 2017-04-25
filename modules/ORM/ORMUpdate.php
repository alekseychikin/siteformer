<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ORM.php';
require_once __DIR__ . '/ORMWhere.php';

class SFORMUpdate extends SFORMWhere
{
  private $table;
  private $params;

  public function __construct($table) {
    $this->table = $table;
  }

  public function values($params) {
    $this->params = $params;

    return $this;
  }

  public function exec($alias = 'default') {
    return $this->execute($alias);
  }

  public function getQuery($alias = 'default') {
    $sql = 'UPDATE `'.$this->table.'`'.N.'SET ';
    $params = array();

    foreach ($this->params as $field => $value) {
      if (gettype($value) == 'object' && method_exists($value, 'get')) {
        $value = $value->get();
      } else {
        $value = $this->quote(SFORM::prepareWriteValue($this->table, $field, $value));
      }

      $params[] = _field_($field).' = '. $value;
    }

    $sql .= implode(', ', $params).N;

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

  public function execute($alias = 'default') {
    $sql = $this->getQuery($alias);

    return parent::query($sql, $alias, true);
  }
}
