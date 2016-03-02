<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once $modulePath . 'SFDB.php';
require_once $modulePath . 'ORMDatabase.php';
require_once $modulePath . 'ORMAlter.php';
require_once $modulePath . 'ORMCreate.php';
require_once $modulePath . 'ORMWhere.php';
require_once $modulePath . 'ORMSelect2.php';
require_once $modulePath . 'ORMDelete.php';
require_once $modulePath . 'ORMUpdate.php';
require_once $modulePath . 'ORMInsert.php';
require_once $modulePath . 'ORMMigrate.php';
require_once $modulePath . 'ORMField.php';
require_once $modulePath . 'ORMFunc.php';

class SFORM extends SFORMDatabase
{
  public static $readModifiers = [];
  public static $writeModifiers = [];

  public static function func ($field) {
    return new SFORMFunc($field);
  }

  public static function field ($field) {
    return new SFORMField($field);
  }

  public static function alter($table) {
    return new SFORMAlter($table);
  }

  public static function create($table, $fields = [], $keys = []) {
    return new SFORMCreate($table, $fields, $keys);
  }

  public static function insert($table) {
    return new SFORMInsert($table);
  }

  public static function select() {
    $args = '*';

    if (func_num_args()) {
      $args = func_get_args();
    }

    return new SFORMSelect($args);
  }

  public static function update($table) {
    return new SFORMUpdate($table);
  }

  public static function delete($table) {
    return new SFORMDelete($table);
  }

  public static function setBase($base) {
    parent::$defaultBase = $base;
  }

  public static function init($params) {
    parent::init($params);

    if (isset($params['modifiers'])) {
      if (!file_exists($params['modifiers'])) die('Not exists modifiers folder: ' . $params['modifiers']);

      $dir = opendir($params['modifiers']);

      while ($file = readdir($dir)) {
        if (substr($file, strrpos($file, '.') + 1) == 'php') {
          include $params['modifiers'] . $file;
        }
      }
    }

    if (isset($params['fixtures'])) {
      if (!file_exists($params['fixtures'])) die('Not exists fixtures file: ' . $params['fixtures']);

      include $params['fixtures'];
    }

    if (isset($params['migrations'])) {
      if (!file_exists($params['migrations'])) die('Not exists migrations folder: ' . $params['migrations']);

      SFORMMigrate::init($params);
    }
  }

  public static function foundRows() {
    $result = self::query('SELECT FOUND_ROWS() AS `length`');

    return $result[0]['length'];
  }

  public static function showError() {
    parent::showError();
  }

  public static function query(
    $sql,
    $alias = 'default',
    $source = false,
    $saveUrl = true
  ) {
    return parent::query($sql, $alias, $source, $saveUrl);
  }

  public static function hasConnection($alias = 'default') {
    return parent::hasConnection($alias);
  }

  public static function exists($table) {
    return parent::exists($table);
  }

  public static function prepareWriteValue($table, $field, $value) {
    if (isset(self::$writeModifiers[$table])) {
      foreach (self::$writeModifiers[$table] as $modifier) {
        if ($field != $modifier[0]) continue;

        if (gettype($modifier[1]) == 'string') {
          $value = call_user_func($modifier[1], $value);
        } elseif (gettype($modifier[1]) == 'object') {
          $value = $modifier[1]($value);
        }
      }
    }

    return $value;
  }

  public static function addWriteModifier($table, $field, $function) {
    if (!isset(self::$writeModifiers[$table])) {
      self::$writeModifiers[$table] = [];
    }

    self::$writeModifiers[$table][] = array($field, $function);
  }

  public static function addReadModifier($table, $fieldTo, $function) {
    if (gettype($fieldTo) == 'array') {
      list($fieldFrom, $fieldTo) = each($fieldTo);
    } else {
      $fieldFrom = $fieldTo;
    }

    if (!isset(self::$readModifiers[$table])) {
      self::$readModifiers[$table] = [];
    }

    self::$readModifiers[$table][] = array($fieldFrom, $fieldTo, $function);
  }

  public static function error() {
    return parent::error();
  }

  public static function migration() {
    return new SFORMMigrate();
  }

  public static function lastQuery() {
    return parent::lastQuery();
  }

  public static function explainLastQuery() {
    $query = 'EXPLAIN ' . parent::lastQuery();

    return parent::query($query, false, false);
  }

  public static function close($alias = 'default') {
    parent::close($alias);
  }
}
