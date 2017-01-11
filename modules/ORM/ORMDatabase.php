<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE."classes/validate.php";

  class SFORMDatabase
  {
    private static $supportPDO;
    private static $connections = array();
    private static $databases = array();
    private static $inits = array();
    private static $lastSQL;
    private static $showError = false;
    private static $lastRes;
    protected static $defaultBase = 'default';
    private static $reports = false;
    private static $cachedPrimaryFields = array();
    private static $cachedFields = array();
    private static $cachedTables = array();
    public static $countQueries = 0;

    protected function makeStringOfField($field)
    {
      return '`' . $field['name'] . '` ' . $field['type'] .
        ($field['null'] !== false ? ' ' . $field['null'] : '') .
        (strlen($field['autoincrement']) ? ' ' . $field['autoincrement'] : '') .
        ($field['default'] !== false && mb_strtolower($field['type']) !== 'text' ?
          ' DEFAULT ' . ($field['default'] === NULL ? 'NULL' : $this->quote($field['default'])) : ''
        );
    }

    protected function validateField($field)
    {
      return SFValidate::value([
        'name' => [
          'required' => true
        ],
        'type' => [
          'required' => true
        ],
        'null' => [
          'default' => NULL
        ],
        'autoincrement' => [
          'default' => false,
          'modify' => function ($value) {
            return ($value ? 'AUTO_INCREMENT' : '');
          }
        ],
        'default' => [
          'default' => NULL,
          'modify' => function ($value) {
            return $value;
          }
        ]
      ], $field);
    }

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
      throw new BaseException($sqlError);
    }

    private static function putReport($sql, $time)
    {
      if (strpos($sql, '__events') === false) {
        SFPath::mkdir(self::$reports);
        if (!file_exists(self::$reports.'queries.log')) {
          $file = fopen(self::$reports.'queries.log', 'w');
        }
        else {
          $file = fopen(self::$reports.'queries.log', 'a');
        }
        fputs($file, $sql." ".$time."\n\n");
        fclose($file);
      }
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
      $timestart = microtime(true);
      if (self::$supportPDO) {
        if (strpos($sql, 'INSERT') === 0) {
          $res = self::$connections[$alias]->exec($sql);
          $err = self::$connections[$alias]->errorInfo();
        } else {
          $res = self::$connections[$alias]->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
          $res->execute();
          $err = $res->errorInfo();
        }

        if (self::$showError && $err[1] !== 0 && $err[1] !== null) {
          self::makeException($err[2]);
        }

        self::$lastRes = $res;
      }
      else {
        if (self::$showError) {
          $res = mysql_query($sql, self::$connections[$alias]) or self::makeException(mysql_error());
        }
        else {
          $res = mysql_query($sql, self::$connections[$alias]);
        }
      }

      self::$countQueries++;

      $endtime = microtime(true);
      if (self::$reports !== false) {
        self::putReport($sql, number_format($endtime - $timestart, 4));
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
      if (self::$supportPDO) {
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
      if (!self::$supportPDO) {
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
      if (is_null($value)) return 'NULL';
      if (is_numeric($value)) return $value;
      if (self::$supportPDO) {
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
      self::$supportPDO = defined('PDO::ATTR_DRIVER_NAME');
      if (!isset($configs['alias'])) {
        $configs['alias'] = 'default';
      }
      if (isset(self::$connections[$configs['alias']]) && self::$connections[$configs['alias']]) {
        self::close($configs['alias']);
      }
      if (self::$supportPDO) {
        self::$connections[$configs['alias']] = new PDO('mysql:dbname=' . $configs['database'] . ';' . $configs['host'], $configs['user'], $configs['password']);
      }
      else  {
        self::$connections[$configs['alias']] = mysql_connect($configs['host'], $configs['user'], $configs['password']);
        if (self::$connections[$params['alias']]) {
          mysql_select_db($configs['database'], self::$connections[$params['alias']]);
        }
      }
      self::$databases[$configs['alias']] = $configs['database'];
      if (isset($configs['reports'])) {
        self::$reports = $configs['reports'];
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

    protected function getPrimaryFields($table, $alias = 'default')
    {
      if (!isset(self::$connections[$alias]) || !self::$connections[$alias]) self::makeException('There is no MySQL connection');
      if (!isset(self::$cachedPrimaryFields[$alias])) {
        self::$cachedPrimaryFields[$alias] = array();
      }
      if (isset(self::$cachedPrimaryFields[$alias][$table])) {
        return self::$cachedPrimaryFields[$alias][$table];
      }
      $primaryFields = array();
      $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);
      if (self::$supportPDO) {
        $numFields = $result->columnCount();
      }
      else {
        $numFields = mysql_num_fields($result);
      }
      for ($i = 0; $i < $numFields; $i++) {
        if (self::$supportPDO) {
          $field = $result->getColumnMeta($i);
        }
        else {
          $field = mysql_fetch_field($result, $i);
        }
        if (self::$supportPDO) {
          $fieldName = $field['name'];
        }
        else {
          $fieldName = $field->name;
        }
        if (self::$supportPDO) {
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
      self::$cachedPrimaryFields[$alias][$table] = $primaryFields;
      return $primaryFields;
    }

    protected function getFields($table, $alias = 'default')
    {
      if (!self::$connections[$alias]) die('There is no MySQL connection');
      if (!isset(self::$cachedFields[$alias])) {
        self::$cachedFields[$alias] = array();
      }
      if (isset(self::$cachedFields[$alias][$table])) {
        return self::$cachedFields[$alias][$table];
      }
      $fields = array();
      $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);
      if (self::$supportPDO) {
        $numFields = $result->columnCount();
      }
      else {
        $numFields = mysql_num_fields($result);
      }
      for ($i = 0; $i < $numFields; $i++) {
        if (self::$supportPDO) {
          $field = $result->getColumnMeta($i);
        }
        else {
          $field = mysql_fetch_field($result, $i);
        }
        if (self::$supportPDO) {
          $fieldName = $field['name'];
        }
        else {
          $fieldName = $field->name;
        }
        if (self::$supportPDO) {
          $fields[] = $fieldName;
        }
        else {
          $fields[] = $fieldName;
        }
      }
      self::$cachedFields[$alias][$table] = $fields;
      return $fields;
    }

    public static function getTables($alias = 'default', $force = false)
    {
      if (isset(self::$databases[$alias])) {
        $database = self::$databases[$alias];
        if (!isset($cachedTables[$database]) || $force) {
          $tables = array();
          $result = self::query('SHOW TABLES FROM `' . $database . '`', $alias, false, false);
          foreach ($result as $item) {
            list($index, $table) = each($item);
            $tables[] = $table;
          }
          $cachedTables[$database] = $tables;
        }
        return $cachedTables[$database];
      }
    }
  }
?>
