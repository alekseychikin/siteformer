<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ORMDatabase.php';

class SFORMAlter extends SFORMDatabase
{
  private $tableName;
  private $orderActions = array();

  public function __construct($tableName) {
    $this->tableName = $tableName;
  }

  public function change($sourceField, $field) {
    $field = $this->validateField($field);
    $this->orderActions[] = array(
      'action' => 'edit',
      'sourceField' => $sourceField,
      'field' => $field
    );
    return $this;
  }

  public function drop($field) {
    $this->orderActions[] = array(
      'action' => 'drop',
      'field' => $field
    );
    return $this;
  }

  public function add($field, $after = false) {
    $field = $this->validateField($field);
    $this->orderActions[] = array(
      'action' => 'add',
      'field' => $field,
      'after' => $after
    );
    return $this;
  }

  public function getQuery() {
    foreach ($this->orderActions as $field) {
      switch ($field['action']) {
        case 'edit':
          return 'ALTER TABLE `' . $this->tableName . '` CHANGE `' . $field['sourceField'] . '` ' .
            $this->makeStringOfField($field['field']);
        case 'drop':
          return 'ALTER TABLE `' . $this->tableName . '` DROP `' . $field['field'] . '`';
        case 'add':
          return 'ALTER TABLE `' . $this->tableName . '` ADD ' .
            $this->makeStringOfField($field['field']) .
            ($field['after'] !== false ? ' AFTER `' . $field['after'] . '`' : '');
      }
    }
  }

  public function exec($alias = 'default') {
    $query = $this->getQuery();
    parent::query($query, $alias);
  }
}
