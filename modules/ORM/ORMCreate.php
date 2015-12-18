<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE."classes/validate.php";
  require_once ENGINE."modules/ORM/ORMDatabase.php";
  require_once ENGINE."modules/ORM/ORMDatabase.php";

  class SFORMCreate extends SFORMDatabase
  {
    private $sql = '';
    private $tableName;
    private $fields = array();
    private $keys = array();

    public function __construct($tableName)
    {
      $this->tableName = $tableName;
    }

    public static function table($tableName)
    {
      return new SFORMCreate($tableName);
    }

    public function addField($field)
    {
      $field = SFValidate::parse(array(
        array(
          'name' => 'name',
          'require' => true,
          'error' => 'Не задано имя поля'
        ),
        array(
          'name' => 'type',
          'require' => true,
          'error' => 'Не задан тип поля'
        ),
        array(
          'name' => 'null',
          'default' => 'NULL'
        ),
        array(
          'name' => 'autoincrement',
          'default' => false,
          'modify' => function ($value)
          {
            return ($value ? 'AUTO_INCREMENT' : '');
          }
        ),
        array(
          'name' => 'default',
          'default' => 'NULL',
          'modify' => function ($value)
          {
            return $value;
          }
        )
      ), $field);
      $this->fields[] = $field;
      return $this;
    }

    public function addKey($fields, $type = 'KEY')
    {
      $keyName = $fields;
      if (gettype($fields) === 'array') {
        $keyName = implode('_', $keyName);
        $fields = implode('`, `', $fields);
      }
      $fields = mb_strtoupper($type) . ' (`' . $fields . '`)';
      $this->keys[] = $fields;
      return $this;
    }

    public function exec($alias = 'default')
    {
      $sql = $this->getSql();
      parent::query($sql, $alias);
    }

    public function getSql()
    {
      $sql = 'CREATE TABLE IF NOT EXISTS `' . $this->tableName . '` (' . "\n";
      $fields = array();
      foreach ($this->fields as $field) {
        $fields[] = '`' . $field['name'] . '` ' . $field['type'] .
          ($field['null'] !== false ? ' ' . $field['null'] : '') .
          (strlen($field['autoincrement']) ? ' ' . $field['autoincrement'] : '') .
          ($field['default'] !== false && mb_strtolower($field['type']) !== 'text' ? ' DEFAULT ' . (mb_strtolower($field['default']) == 'null' ? 'NULL' : $this->quote($field['default'])) : '');
      }

      foreach ($this->keys as $key) {
        $fields[] = $key;
      }

      $sql .= implode(",\n", $fields);
      $sql .= "\n" . ') ENGINE=InnoDB DEFAULT CHARSET=utf8';
      return $sql;
    }
  }

?>
