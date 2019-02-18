<?php

require_once __DIR__ . '/SFDB.php';
require_once __DIR__ . '/ORMDatabase.php';
require_once __DIR__ . '/ORMAlter.php';
require_once __DIR__ . '/ORMCreate.php';
require_once __DIR__ . '/ORMDrop.php';
require_once __DIR__ . '/ORMWhere.php';
require_once __DIR__ . '/ORMSelect.php';
require_once __DIR__ . '/ORMDelete.php';
require_once __DIR__ . '/ORMUpdate.php';
require_once __DIR__ . '/ORMInsert.php';
require_once __DIR__ . '/ORMField.php';
require_once __DIR__ . '/ORMFunc.php';
require_once __DIR__ . '/ORMCustomValue.php';

class SFORM extends SFORMDatabase {
  public static function init($params) {
    if (!parent::init($params)) {
      return false;
    }

    if (isset($params['fixtures'])) {
      if (!file_exists($params['fixtures'])) die('Not exists fixtures file: ' . $params['fixtures']);

      include $params['fixtures'];
    }

    return true;
  }

  public static function func ($field) {
    return new SFORMFunc($field);
  }

  public static function field ($field) {
    return new SFORMField($field);
  }

  public static function alter($table) {
    return new SFORMAlter($table);
  }

  public static function create($table) {
    return new SFORMCreate($table);
  }

  public static function drop($table) {
    return new SFORMDrop($table);
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

  public static function lastId($table, $alias = 'default') {
    return parent::lastId($table, $alias);
  }

  public static function foundRows() {
    $result = self::query('SELECT FOUND_ROWS() AS `length`');

    return $result[0]['length'];
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

  public static function error() {
    return parent::error();
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

  public static function generateValue($pattern, $params) {
    return new SFORMCustomValue($pattern, $params);
  }

  public static function getPrimaryFields($table, $alias = 'default') {
    return parent::getPrimaryFields($table, $alias);
  }

  public static function getFields($table, $alias = 'default') {
    return parent::getFields($table, $alias);
  }
}
