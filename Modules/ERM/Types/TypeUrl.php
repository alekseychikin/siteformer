<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Classes\Validate;
use \Engine\Modules\ERM\ERM;
use \Engine\Modules\ERM\ERMType;
use \Engine\Modules\ORM\ORM;

class TypeUrl extends ERMType {
	public static $name = 'Урл';
	public static $type = 'url';
	public static $requiredable = true;
	public static $settings = [
		'source' => ''
	];

	public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
		return Validate::value([
			'source' => [
				'required' => true
			]
		], $settings, $indexes);
	}

	public static function prepareInsertData($collection, $field, $data) {
		$collection = ERM::getCollection($collection);
		$settings = $field['settings'];

		if (empty($data[$field['alias']]) && empty($data[$settings['source']])) {
			return '';
		}

		$value = $data[$field['alias']];

		if (empty($value)) {
			$value = $data[$settings['source']];
		}

		$value = mb_strtolower(Text::removeSpecialCharacters($value), 'utf-8');
		$value = Text::translite($value);

		$record = ORM::select()
			->from($collection['table'])
			->where($field['alias'], $value);

		$i = 1;
		$newValue = $value;

		while ($record->length()) {
			$newValue = $value . '-' . ++$i;
			$record = ORM::select()
				->from($collection['table'])
				->where($field['alias'], $newValue);
		}

		return $newValue;
	}

	public static function prepareUpdateData($collection, $field, $currentData, $data) {
		$collection = ERM::getCollection($collection);
		$settings = $field['settings'];

		if (empty($data[$field['alias']]) && empty($data[$settings['source']])) {
			return '';
		}

		$value = $data[$field['alias']];

		if (empty($value)) {
			$value = $data[$settings['source']];
		}

		$value = mb_strtolower(Text::removeSpecialCharacters($value), 'utf-8');
		$value = Text::translite($value);

		$record = ORM::select()
			->from($collection['table'])
			->where($field['alias'], $value)
			->andWhere('id', '!=', $currentData['id']);

		$i = 1;
		$newValue = $value;

		while ($record->length()) {
			$newValue = $value . '-' . ++$i;
			$record = ORM::select()
				->from($collection['table'])
				->where($field['alias'], $newValue)
				->andWhere('id', '!=', $currentData['id']);
		}

		return $newValue;
	}
}
