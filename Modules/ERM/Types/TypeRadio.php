<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Classes\Validate;
use \Engine\Modules\ERM\ERMType;

class TypeRadio extends ERMType {
	public static $name = 'Переключатели';
	public static $type = 'radio';
	public static $requiredable = false;
	public static $settings = [
		'checked' => -1,
		'values' => ['']
	];

	public static function getSqlField($params) {
		return [
			'type' => 'INT(6)',
			'default' => $params['checked']
		];
	}

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		return Validate::value([
			'checked' => [
				'type' => 'int'
			],
			'values' => [
				'minlength' => 1,
				'collection' => [
					'required' => true,
					'unique' => true,
					'skipempty' => true
				]
			]
		], $settings, $indexes);
	}

	public static function getDefaultData($settings) {
		return $settings['checked'];
	}
}
