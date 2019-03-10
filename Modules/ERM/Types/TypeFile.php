<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Classes\Validate;
use \Engine\Classes\Storages;
use \Engine\Modules\ERM\ERMType;

class TypeFile extends ERMType {
	public static $name = 'Файл';
	public static $type = 'file';
	public static $requiredable = true;
	public static $settings = [
		'storage' => '',
		'path' => '',
		'ext' => ''
	];

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		return Validate::value([
			'storage' => [
				'values' => Storages::getStorageList()
			],
			'path' => [
				'valid' => function ($value) use ($settings, $indexes) {
					return Storages::checkWritablePath($settings['storage'], $value, array_merge($indexes, ['path']));
				}
			]
		], $settings, $indexes);
	}

	public static function prepareInsertData($collection, $field, $data) {
		$settings = $field['settings'];
		$value = $data[$field['alias']];

		return Storages::put($settings['storage'], $value, $settings['path']);
	}

	public static function prepareUpdateData($collection, $field, $currentData, $data) {
		if ($currentData[$field['alias']] === $data[$field['alias']]) {
			return $data[$field['alias']];
		}

		$value = $data[$field['alias']];

		$settings = $field['settings'];

		Storages::delete($settings['storage'], $currentData[$field['alias']]);

		return Storages::put($settings['storage'], $value, $settings['path']);
	}
}
