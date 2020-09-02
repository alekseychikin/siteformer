<?php

namespace Engine\Modules\ORM;

use Engine\Classes\Validate;

class ORMAlter extends ORMDatabase {
  private $tableName;
  private $orderActions = [];

  public function __construct($tableName) {
    $this->tableName = $tableName;
  }

  public function addField($field, $after = false) {
    $field = $this->validateField($field);
    $this->orderActions[] = [
      'action' => 'add-field',
      'field' => $field,
      'after' => $after
    ];

    return $this;
  }

  public function changeField($sourceField, $field) {
    $field = $this->validateField($field);
    $this->orderActions[] = [
      'action' => 'edit-field',
      'sourceField' => $sourceField,
      'field' => $field
    ];

    return $this;
  }

  public function dropField($field) {
    $this->orderActions[] = [
      'action' => 'drop-field',
      'field' => $field
    ];

    return $this;
  }

  public function addIndex($fields, $type = 'KEY') {
    $keyName = $fields;

    $type = Validate::value([
      'values' => ['KEY', 'PRIMARY KEY', 'UNIQUE']
    ], strtoupper($type));

    if (gettype($fields) === 'array') {
      $keyName = implode('_', $keyName);
      $fields = implode('`, `', $fields);
    }

    $fields = mb_strtoupper($type) . ' `' . $keyName .'` (`' . $fields . '`)';
    $this->orderActions[] = [
      'action' => 'add-index',
      'fields' => $fields
    ];

    return $this;
  }

  public function dropIndex($keyName) {
    $this->orderActions[] = [
      'action' => 'drop-index',
      'keyName' => $keyName
    ];

    return $this;
  }

  public function getQuery() {
    $parts = [];

    foreach ($this->orderActions as $field) {
      switch ($field['action']) {
        case 'edit-field':
          $parts[] = 'ALTER TABLE `' . $this->tableName . '` CHANGE `' . $field['sourceField'] . '` ' .
            $this->makeStringOfField($field['field']);
          break;
        case 'drop-field':
          $parts[] = 'ALTER TABLE `' . $this->tableName . '` DROP `' . $field['field'] . '`';
          break;
        case 'add-field':
          $parts[] = 'ALTER TABLE `' . $this->tableName . '` ADD ' .
            $this->makeStringOfField($field['field']) .
            ($field['after'] !== false ? ' AFTER `' . $field['after'] . '`' : '');
          break;
        case 'add-index':
          $parts[] = 'ALTER TABLE `' . $this->tableName . '` ADD ' . $field['fields'];
          break;
        case 'drop-index':
          $parts[] = 'ALTER TABLE `' . $this->tableName . '` DROP INDEX `' . $field['keyName'] . '`';
          break;
      }
    }

    return implode(';', $parts);
  }

  public function exec($alias = 'default') {
    $query = $this->getQuery();
    parent::query($query, $alias);
    parent::dropCacheFields($this->tableName, $alias);
  }
}
