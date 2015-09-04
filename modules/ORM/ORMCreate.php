<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMCreate extends SFORMDatabase
  {
    private $sql = '';

    public function __construct($tableName, $fields = array(), $indexes = array())
    {
      $sql = "CREATE TABLE IF NOT EXISTS `".$tableName."` (\n";
      $fields_ = array();
      foreach ($fields as $field) {
        $field = explode(' ', $field);
        $fieldName = $field[0];
        unset($field[0]);
        $fields_[] = '`'.$fieldName.'` '.implode(' ', $field);
      }
      $sql .= implode(",\n", $fields_);
      $indexes_ = array();
      foreach ($indexes as $field) {
        $field = explode(' ', $field);
        $keyType = $field[0];
        unset($field[0]);
        switch ($keyType) {
          case 'primary':
            $indexes_[] = 'PRIMARY KEY (`'.implode('`, `', $field).'`)';
            break;
          case 'key':
            $indexes_[] = 'KEY `'.implode('_', $field).'` (`'.implode('`, `', $field).'`)';
            break;
        }
      }
      if (count($indexes_)) {
        $sql .= ",\n".implode(",\n", $indexes_);
      }
      $sql .= "\n)  ENGINE=InnoDB  DEFAULT CHARSET=utf8\n";
      $this->sql = $sql;
    }

    public function exec($alias = 'default')
    {
      parent::query($this->sql, $alias);
    }

    public function getSql()
    {
      return $this->sql;
    }
  }

?>
