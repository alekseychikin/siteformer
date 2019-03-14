<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Classes\Validate;
use \Engine\Modules\ORM\ORM;
use \Engine\Modules\ERM\ERM;
use \Engine\Modules\ERM\ERMType;

class TypeCollection extends ERMType {
	public static $name = 'Коллекция';
	public static $type = 'collection';
	public static $requiredable = true;
	public static $settings = [
		'collection' => '',
		'field' => ''
	];

	public static function getSqlField($params) {
		return [
			'type' => 'INT(11)',
			'null' => true,
			'default' => null
		];
	}

	public static function prepareInsertData($collection, $field, $data) {
		if (empty($data[$field['alias']])) {
			return null;
		}

		return $data[$field['alias']];
	}

	public static function prepareUpdateData($collection, $field, $currentData, $data) {
		if (empty($data[$field['alias']])) {
			return null;
		}

		return $data[$field['alias']];
	}

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		return Validate::value([
			'collection' => [
				'required' => true
			],
			'field' => [
				'required' => true
			]
		], $settings, $indexes);
	}

	public static function getDefaultData($settings) {
		return [
			'id' => '',
			'title' => ''
		];
	}

	public static function joinData($databaseQuery, $collection, $field) {
		$joinCollection = ERM::getCollection($field['settings']['collection']);
		$databaseQuery->join($joinCollection['table'])
		->on($joinCollection['table'] . '.id', ORM::field($collection['table'] . '.' . $field['alias']));
	}

	public static function postProcessData($collection, $field, $data) {
		$joinCollection = ERM::getCollection($field['settings']['collection']);

		if (isset($data[$joinCollection['table']]) && isset($data[$joinCollection['table']][0])) {
			$data[$field['alias']] = $data[$joinCollection['table']][0];
			unset($data[$joinCollection['table']]);

			return $data;
		}

		unset($data[$joinCollection['table']]);

		$data[$field['alias']] = [
			'title' => '',
			'id' => ''
		];

		return $data;
	}
}
