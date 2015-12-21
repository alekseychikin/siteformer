<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE."classes/validate.php";
  require_once ENGINE."modules/ORM/ORMDatabase.php";

  class SFORMAlter extends SFORMDatabase
  {
    private $tableName;
    private $orderActions = array();

    public function __construct($tableName)
    {
      $this->tableName = $tableName;
    }

    public function change($sourceField, $field)
    {
      $field = $this->validateField($field);
      $this->orderActions[] = array(
        'action' => 'edit',
        'sourceField' => $sourceField,
        'field' => $field
      );
      return $this;
    }

    public function drop($field)
    {
      $this->orderActions[] = array(
        'action' => 'drop',
        'field' => $field
      );
      return $this;
    }

    public function add($field, $after = false)
    {
      $field = $this->validateField($field);
      $this->orderActions[] = array(
        'action' => 'add',
        'field' => $field,
        'after' => $after
      );
      return $this;
    }

    public function exec($alias = 'default')
    {
      foreach ($this->orderActions as $field) {
        switch ($field['action']) {
          case 'edit':
            $sql = 'ALTER TABLE `' . $this->tableName . '` CHANGE `' . $field['sourceField'] . '` ' .
              $this->makeStringOfField($field['field']);
            parent::query($sql, $alias);
            break;
          case 'drop':
            $sql = 'ALTER TABLE `' . $this->tableName . '` DROP `' . $field['field'] . '`';
            parent::query($sql, $alias);
            break;
          case 'add':
            $sql = 'ALTER TABLE `' . $this->tableName . '` ADD ' .
              $this->makeStringOfField($field['field']) .
              ($field['after'] !== false ? ' AFTER `' . $field['after'] . '`' : '');
            parent::query($sql, $alias);
            break;
        }
      }
    }
  }

?>
