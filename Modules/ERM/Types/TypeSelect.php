<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Classes\Validate;
use \Engine\Modules\ERM\ERMType;

class TypeSelect extends ERMType {
	public static $name = 'Выпадайка';
	public static $type = 'select';
	public static $requiredable = false;
	public static $settings = [
		'checked' => -1,
		'values' => []
	];

	public static function getSqlField($params) {
		return [
			'type' => 'ENUM("' . implode('", "', array_keys($params['values'])) . '")',
			'default' => $params['default']
		];
	}

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		return Validate::value([
			'default' => array_keys($settings['values']),
			'values' => [
				'type' => 'array'
			]
		], $settings, $indexes);
	}

	public static function postProcessData($collection, $field, $data) {
		$data[$field['alias']] = [
			'title' => $field['settings']['values'][$data[$field['alias']]],
			'value' => $data[$field['alias']]
		];

		return $data;
	}

	public static function getDefaultData($settings) {
		return $settings['default'];
	}
}
