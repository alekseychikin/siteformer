<?php

require_once __DIR__ . '/../../classes/validate.php';
require_once __DIR__ . '/../../classes/base-exception.php';

class SFORMDatabase {
  public static $countQueries = 0;
  protected static $defaultBase = 'default';
  private static $supportPDO;
  private static $connections = [];
  private static $databases = [];
  private static $inits = [];
  private static $lastSQL;
  private static $lastRes;
  private static $reports = false;
  private static $cachedPrimaryFields = [];
  private static $cachedFields = [];
  private static $cachedTables = [];
  private static $existsTableList = [];
  private static $lastInsertIds = [];

  public static function init($configs) {
    self::$supportPDO = defined('PDO::ATTR_DRIVER_NAME');

    if (!isset($configs['alias'])) {
      $configs['alias'] = 'default';
    }

    $alias = $configs['alias'];

    if (isset(self::$connections[$alias]) && self::$connections[$alias]) {
      self::close($alias);
    }

    if (self::$supportPDO) {
      $dsn = 'mysql:host=' . $configs['host'] . (isset($configs['database']) ? ';dbname=' . $configs['database'] : '');

      try {
        self::$connections[$alias] = new PDO($dsn, $configs['user'], $configs['password'], [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
      } catch (PDOException $e) {
        throw new BaseException($e);
      }
    } else  {
      try {
        self::$connections[$alias] = mysql_connect($configs['host'], $configs['user'], $configs['password']);
      } catch (Exception $e) {
        throw new BaseException($e);
      }

      if (!self::$connections[$alias]) {
        return false;
      }

      if (self::$connections[$alias] && isset($configs['database'])) {
        mysql_select_db($configs['database'], self::$connections[$alias]);
      }
    }

    if (isset($configs['reports'])) {
      self::$reports = $configs['reports'];
    }

    if (isset($configs['database'])) {
      self::$databases[$alias] = $configs['database'];

      self::updateExistsTableList();
    }

    return true;
  }

  public static function getDatabases($alias = 'default') {
    $databases = arrMap(self::query('show databases'), function ($item) {
      return $item['Database'];
    });

    return $databases;
  }

  public static function setDatabase($database, $alias = 'default') {
    if (!in_array($database, self::getDatabases($alias))) {
      throw new BaseException('No such database: ' . $database);
    }

    return self::query('use `' . $database . '`');
  }

  public static function getTables($alias = 'default', $force = false) {
    if (isset(self::$databases[$alias])) {
      $database = self::$databases[$alias];

      if (!isset($cachedTables[$database]) || $force) {
        $tables = [];
        $result = self::query('SHOW TABLES FROM `' . $database . '`', $alias, false, false);

        foreach ($result as $item) {
          list($index, $table) = each($item);
          $tables[] = $table;
        }

        $cachedTables[$database] = $tables;
      }

      return $cachedTables[$database];
    }

    return [];
  }

  protected function makeStringOfField($field) {
    $null = ($field['null'] !== false ? ' NULL' : ' NOT NULL');
    $autoincrement = ($field['autoincrement'] ? ' AUTO_INCREMENT' : '');

    $default = '';

    if ($field['default'] !== false && mb_strtolower($field['type']) !== 'text') {
      $default = ' DEFAULT ' . ($field['default'] === NULL ? 'NULL' : self::quote($field['default']));
    }

    return '`' . $field['name'] . '` ' . $field['type'] . $null . $autoincrement . $default;
  }

  protected function validateField($field) {
    $res = SFValidate::value([
      'name' => [
        'required' => true
      ],
      'type' => [
        'required' => true
      ],
      'null' => [
        'default' => false
      ],
      'autoincrement' => [
        'default' => false
      ]
    ], $field);

    $res['default'] = false;

    if (isset($field['default'])) {
      $res['default'] = $field['default'];
    }

    return $res;
  }

  protected static function hasConnection($alias = 'default') {
    return (isset(self::$connections[$alias]) && self::$connections[$alias]);
  }

  protected static function exists($table) {
    return in_array($table, self::$existsTableList);
  }

  protected static function updateExistsTableList() {
    $tables = [];
    $res = self::query('SHOW TABLES');

    foreach ($res as $tabs) {
      foreach ($tabs as $table) {
        $tables[] = $table;
      }
    }

    self::$existsTableList = $tables;
  }

  protected static function query($sql, $alias = false, $source = false, $saveQuery = true) {
    if ($alias === false) {
      $alias = self::$defaultBase;
    }

    if (!isset(self::$connections[$alias]) || !self::$connections[$alias]) die('There is no MySQL connection');

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

        preg_match('/^INSERT INTO \`?(.*?)\`?\s/i', $sql, $matches);
        $tableName = $matches[1];
        self::$lastInsertIds[$tableName] = self::$connections[$alias]->lastInsertId();
      } else {
        $res = self::$connections[$alias]->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL]);
        $res->execute();
        $err = $res->errorInfo();
      }

      if ($err[1] !== 0 && $err[1] !== null) {
        self::makeException($err[2] . "\n\n" . $sql);
      }

      self::$lastRes = $res;
    } else {
      $res = mysql_query($sql, self::$connections[$alias]) or self::makeException(mysql_error() . "\n\n" . $sql);

      if (strpos($sql, 'INSERT') !== false) {
        preg_match('/^INSERT INTO \`?(.*?)\`?\s/i', $sql, $matches);
        $tableName = $matches[1];
        self::$lastInsertIds[$tableName] = mysql_insert_id(self::$connections[$alias]);
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
    $result = [];

    while ($row = self::fetch($res, $firstRow)) {
      $result[] = self::typify($row);
      $firstRow = false;
    }

    if (self::$supportPDO) {
      $res->closeCursor();
      $res = null;
    } else {
      mysql_free_result($res);
      $res = null;
    }

    return $result;
  }

  protected static function close($alias = 'default') {
    if (!self::$supportPDO) {
      mysql_close(self::$connections[$alias]);
    }

    self::$connections[$alias] = null;

    self::$inits = [];
    self::$connections = [];
  }

  protected static function error() {
    $err = self::$lastRes->errorInfo();

    return $err[2];
  }

  protected static function lastQuery() {
    return self::$lastSQL;
  }

  protected static function quote($value) {
    if (gettype($value) === 'boolean') return $value ? '\'true\'' : '\'false\'';

    if (is_null($value)) return 'NULL';

    if (is_numeric($value)) return $value;

    if (self::$supportPDO) {
      list($index, $connection) = each(self::$connections);
      reset(self::$connections);

      return $connection->quote($value);
    }

    return '\''.mysql_real_escape_string($value).'\'';
  }

  protected static function lastId($table, $alias = 'default') {
    if (!self::$connections[$alias]) die('There is no MySQL connection');

    if (isset(self::$lastInsertIds[$table])) {
      return self::$lastInsertIds[$table];
    }

    return 0;
  }

  protected static function getPrimaryFields($table, $alias = 'default') {
    if (!isset(self::$connections[$alias]) || !self::$connections[$alias]) self::makeException('There is no MySQL connection');

    if (!isset(self::$cachedPrimaryFields[$alias])) {
      self::$cachedPrimaryFields[$alias] = [];
    }

    if (isset(self::$cachedPrimaryFields[$alias][$table])) {
      return self::$cachedPrimaryFields[$alias][$table];
    }

    $primaryFields = [];
    $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);

    if (self::$supportPDO) {
      $numFields = $result->columnCount();
    } else {
      $numFields = mysql_num_fields($result);
    }

    for ($i = 0; $i < $numFields; $i++) {
      if (self::$supportPDO) {
        $field = $result->getColumnMeta($i);
      } else {
        $field = mysql_fetch_field($result, $i);
      }

      if (self::$supportPDO) {
        $fieldName = $field['name'];
      } else {
        $fieldName = $field->name;
      }

      if (self::$supportPDO) {
        if (in_array('primary_key', $field['flags'])) {
          $primaryFields[] = $fieldName;
        }
      } else {
        if ($field->primary_key == '1') {
          $primaryFields[] = $fieldName;
        }
      }
    }

    self::$cachedPrimaryFields[$alias][$table] = $primaryFields;

    return $primaryFields;
  }

  protected static function getFields($table, $alias = 'default') {
    if (!self::$connections[$alias]) die('There is no MySQL connection');

    if (!isset(self::$cachedFields[$alias])) {
      self::$cachedFields[$alias] = [];
    }

    if (isset(self::$cachedFields[$alias][$table])) {
      return self::$cachedFields[$alias][$table];
    }

    $fields = [];
    $result = self::query('SELECT * FROM `'.$table.'` LIMIT 1', $alias, true, false);

    if (self::$supportPDO) {
      $numFields = $result->columnCount();
    } else {
      $numFields = mysql_num_fields($result);
    }

    for ($i = 0; $i < $numFields; $i++) {
      if (self::$supportPDO) {
        $field = $result->getColumnMeta($i);
      } else {
        $field = mysql_fetch_field($result, $i);
      }

      if (self::$supportPDO) {
        $fieldName = $field['name'];
      } else {
        $fieldName = $field->name;
      }

      if (self::$supportPDO) {
        $fields[] = $fieldName;
      } else {
        $fields[] = $fieldName;
      }
    }

    self::$cachedFields[$alias][$table] = $fields;

    return $fields;
  }

  protected function dropCacheFields($table, $alias = 'default') {
    unset(self::$cachedPrimaryFields[$alias][$table]);
    unset(self::$cachedFields[$alias][$table]);
  }

  private static function fetch($result, $firstRow = false) {
    try {
      if (defined('PDO::FETCH_BOTH')) {
        if ($firstRow) {
          return $result->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_ABS, 0);
        } else {
          return $result->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
        }
      } else {
        return mysql_fetch_assoc($result);
      }
    } catch (PDOException $e) {
      return [];
    }
  }

  private static function makeException($sqlError) {
    throw new BaseException($sqlError);
  }

  private static function putReport($sql, $time) {
    if (strpos($sql, '__events') === false) {
      mkdirRecoursive(self::$reports);

      if (!file_exists(self::$reports.'queries.log')) {
        $file = fopen(self::$reports.'queries.log', 'w');
      } else {
        $file = fopen(self::$reports.'queries.log', 'a');
      }

      fputs($file, $sql." ".$time."\n\n");
      fclose($file);
    }
  }

  private static function typify($row) {
    foreach ($row as $field => $value) {
      if (preg_match('/^\d+$/', $value)) $row[$field] = (int) $value;
      if (preg_match('/^\d+\.\d+$/', $value)) $row[$field] = (float) $value;
      if (preg_match('/^(false|true)$/', $value)) $row[$field] = $value === 'true' ? true : false;
    }

    return $row;
  }
}
