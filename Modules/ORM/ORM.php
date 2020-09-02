<?php

namespace Engine\Modules\ORM;

class ORM extends ORMDatabase {
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

	public static function func($field) {
		return new ORMFunc($field);
	}

	public static function field($field) {
		return new ORMField($field);
	}

	public static function alter($table) {
		return new ORMAlter($table);
	}

	public static function create($table) {
		return new ORMCreate($table);
	}

	public static function drop($table) {
		return new ORMDrop($table);
	}

	public static function insert($table) {
		return new ORMInsert($table);
	}

	public static function select() {
		$args = '*';

		if (func_num_args()) {
			$args = func_get_args();
		}

		return new ORMSelect($args);
	}

	public static function update($table) {
		return new ORMUpdate($table);
	}

	public static function delete($table) {
		return new ORMDelete($table);
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

	public static function queryWithParams(
		$sql,
		$params,
		$alias = 'default',
		$source = false,
		$saveUrl = true
	) {
		return parent::query(self::prepareQuery($sql, $params), $alias, $source, $saveUrl);
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
		return new ORMCustomValue($pattern, $params);
	}

	public static function getPrimaryFields($table, $alias = 'default') {
		return parent::getPrimaryFields($table, $alias);
	}

	public static function getFields($table, $alias = 'default') {
		return parent::getFields($table, $alias);
	}

	public static function prepareQuery($query, $params) {
		$result = $query;

		foreach ($params as $field => $value) {
			if (gettype($value) === 'array') {
				if (count($value)) {
					$arrayValues = [];

					foreach ($value as $arrayValue) {
						$arrayValues[] = ORM::quote($arrayValue);
					}

					$value = implode(', ', $arrayValues);
				} else {
					$value = 'NULL';
				}
			} else {
				$value = ORM::quote($value);
			}

			$result = str_replace(':' . $field, $value, $result);
		}

		return $result;
	}
}
