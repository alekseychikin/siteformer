<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMDatabase
  {
    private static $connections = array();
    private static $inits = array();
    private static $lastSQL;
    private static $showError = false;
    private static $lastRes;
    protected static $defaultBase = 'default';

    protected static function hasConnection($alias = 'default')
    {
      return (isset(self::$connections[$alias]) && self::$connections[$alias]);
    }

    protected static function exists($table)
    {
      $tables = array();
      $res = self::query('SHOW TABLES');
      foreach ($res as $tabs) {
        list($index, $tab) = each ($tabs);
        $tables[] = $tab;
      }
      return in_array($table, $tables);
    }

    private static function makeException($sqlError)
    {
      $e = new Exception;
      $trace = $e->getTrace();
      echo self::$lastSQL . "\n\n" . $sqlError."\n\n";
      print_r($trace);
      die();
    }

    protected static function query($sql, $alias = false, $source = false, $saveQuery = true)
    {
      if ($alias === false) {
        $alias = self::$defaultBase;
      }
      if (!self::$connections[$alias]) die('There is no MySQL connection');

      if (!isset(self::$inits[$alias]) || !self::$inits[$alias]) {
        self::$inits[$alias] = true;
        self::query('SET NAMES "utf8"', $alias);
      }
      $res = false;
      if ($saveQuery) {
        self::$lastSQL = $sql;
      }
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        $res = self::$connections[$alias]->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $res->execute();
        self::$lastRes = $res;
        $err = $res->errorInfo();
        $errCode = (int) $err[0];
        if (self::$showError && $errCode !== 0) {
          self::makeException($err[2]);
        }
      }
      else {
        if (self::$showError) {
          $res = mysql_query($sql, self::$connections[$alias]) or self::makeException(mysql_error());
        }
        else {
          $res = mysql_query($sql, self::$connections[$alias]);
        }
      }
      if ($source) {
        return $res;
      }
      $firstRow = true;
      $result = array();
      while ($row = self::fetch($res, $firstRow)) {
        $result[] = $row;
        $firstRow = false;
      }
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        $res->closeCursor();
        $res = null;
      }
      else {
        mysql_free_result($res);
        $res = null;
      }
      return $result;
    }

    protected static function close($alias = 'default')
    {
      if (!defined('PDO::ATTR_DRIVER_NAME')) {
        mysql_close(self::$connections[$alias]);
      }
      self::$connections[$alias] = null;
      unset(self::$inits[$alias]);
      unset(self::$connections[$alias]);
      self::$init = false;
    }

    protected static function showError()
    {
      self::$showError = true;
    }

    protected static function error()
    {
      $err = self::$lastRes->errorInfo();
      return $err[2];
    }

    protected static function lastQuery()
    {
      return self::$lastSQL;
    }

    protected function quote($value)
    {
      if (is_numeric($value)) return $value;
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        list($index, $connection) = each(self::$connections);
        reset(self::$connections);
        return $connection->quote($value);
      }
      else {
        return '\''.mysql_real_escape_string($value).'\'';
      }
    }

    public static function init($configs)
    {
      if (!isset($configs['alias'])) {
        $configs['alias'] = 'default';
      }
      if (isset(self::$connections[$configs['alias']]) && self::$connections[$configs['alias']]) {
        self::close($configs['alias']);
      }
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        self::$connections[$configs['alias']] = new PDO('mysql:dbname='.$configs['database'].';'.$configs['host'], $configs['user'], $configs['password']);
      }
      else  {
        self::$connections[$configs['alias']] = mysql_connect($configs['host'], $configs['user'], $configs['password']);
        if (self::$connections[$params['alias']]) {
          mysql_select_db($configs['database'], self::$connections[$params['alias']]);
        }
      }
    }

    private static function fetch($result, $firstRow = false)
    {
      if (defined('PDO::FETCH_BOTH')) {
        if ($firstRow) {
          return $result->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_ABS, 0);
        }
        else {
          return $result->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
        }
      }
      else {
        return mysql_fetch_assoc($result);
      }
    }

    protected function lastId($alias = 'default')
    {
      if (!self::$connections[$alias]) die('There is no MySQL connection');
      return self::$connections[$alias]->lastInsertId();
    }

    protected function getPrimaryFields($alias = 'default', $table)
    {
      if (!isset(self::$connections[$alias]) || !self::$connections[$alias]) self::makeException('There is no MySQL connection');
      $primaryFields = array();
      $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        $numFields = $result->columnCount();
      }
      else {
        $numFields = mysql_num_fields($result);
      }
      for ($i = 0; $i < $numFields; $i++) {
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          $field = $result->getColumnMeta($i);
        }
        else {
          $field = mysql_fetch_field($result, $i);
        }
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          $fieldName = $field['name'];
        }
        else {
          $fieldName = $field->name;
        }
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          if (in_array('primary_key', $field['flags'])) {
            $primaryFields[] = $fieldName;
          }
        }
        else {
          if ($field->primary_key == '1') {
            $primaryFields[] = $fieldName;
          }
        }
      }
      return $primaryFields;
    }

    protected function getFields($table, $alias = 'default')
    {
      if (!self::$connections[$alias]) die('There is no MySQL connection');
      $fields = array();
      $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);
      if (defined('PDO::ATTR_DRIVER_NAME')) {
        $numFields = $result->columnCount();
      }
      else {
        $numFields = mysql_num_fields($result);
      }
      for ($i = 0; $i < $numFields; $i++) {
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          $field = $result->getColumnMeta($i);
        }
        else {
          $field = mysql_fetch_field($result, $i);
        }
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          $fieldName = $field['name'];
        }
        else {
          $fieldName = $field->name;
        }
        if (defined('PDO::ATTR_DRIVER_NAME')) {
          $fields[] = $fieldName;
        }
        else {
          $fields[] = $fieldName;
        }
      }
      return $fields;
    }
  }
?>
