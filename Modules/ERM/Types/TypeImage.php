<?php

namespace Engine\Modules\ERM\Types;

use Engine\Classes\Image;
use Engine\Classes\Validate;
use Engine\Classes\Storages;
use Engine\Modules\ERM\ERMType;

class TypeImage extends ERMType {
	public static $name = 'Изображение';
	public static $type = 'image';
	public static $requiredable = true;
	public static $settings = [
		'storage' => '',
		'path' => '',
		'width' => 1000,
		'height' => 560,
		'saveRatio' => true,
		'source' => 'upload'
	];

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		$sources = self::getSources($fields, $settings, $currentAlias);

		$storage = $settings['storage'];

		$settings = Validate::value([
			'storage' => [
				'values' => Storages::getStorageList()
			],
			'path' => [
				'valid' => function ($value) use ($settings, $indexes) {
					return Storages::checkWritablePath($settings['storage'], $value, array_merge($indexes, ['path']));
				}
			],
			'width' => [],
			'height' => [],
			'saveRatio' => [],
			'source' => [
				'valid' => function ($value) use ($fields, $sources) {
					$usedSource = [$value];

					while (true) {
						if ($value === 'upload') return true;
						if (!in_array($value, $sources)) return false;

						$found = false;

						foreach ($fields as $field) {
							if ($field['alias'] === $value) {
								$settings = json_decode($field['settings'], true);

								if ($settings['source'] === 'upload') {
									return true;
								} elseif (in_array($settings['source'], $usedSource)) {
									return false;
								}

								$usedSource[] = $value;
								$value = $settings['source'];
								$found = true;

								break;
							}
						}

						if (!$found) {
							return false;
						}
					}

					return true;
				},
				'default' => 'upload'
			]
		], $settings, $indexes);

		if ($settings['source'] !== 'upload') {
			$settings['hide'] = true;
		}

		return $settings;
	}

	public static function detectSource($field) {
		if (isset($field['settings']) && isset($field['settings']['source']) && $field['settings']['source'] !== 'upload') {
			return $field['settings']['source'];
		}

		return false;
	}

	public static function prepareInsertData($collection, $field, $data) {
		$settings = $field['settings'];

		if ($settings['source'] === 'upload') {
			$value = $data[$field['alias']];
		} else {
			$value = $data[$settings['source']];
		}

		if (!$value || $value === 'false') return '';

		Image::resize($value, $settings);

		return Storages::put($settings['storage'], $value, $settings['path']);
	}

	public static function prepareUpdateData($collection, $field, $currentData, $data) {
		if ($currentData[$field['alias']] === $data[$field['alias']]) {
			return $data[$field['alias']];
		}

		$settings = $field['settings'];

		if ($settings['source'] === 'upload') {
			$value = $data[$field['alias']];
		} else {
			$value = $data[$settings['source']];
		}

		if (!$value || $value === 'false') return '';

		Image::resize($value, $settings);

		Storages::delete($settings['storage'], $currentData[$field['alias']]);

		return Storages::put($settings['storage'], $value, $settings['path']);
	}

	private static function getSources($fields, $currentField, $currentAlias) {
		$sources = ['upload'];

		foreach ($fields as $field) {
			if ($field['type'] == 'image' && $currentAlias != $field['alias']) {
				$sources[] = $field['alias'];
			}
		}

		return $sources;
	}
}
