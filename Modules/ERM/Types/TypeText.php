<?php

namespace Engine\Modules\ERM\Types;

use Engine\Modules\ERM\ERMType;

class TypeText extends ERMType {
	public static $name = 'Текст';
	public static $type = 'text';
	public static $requiredable = true;
	public static $settings = [
		'text' => ''
	];

	public static function getSqlField($params) {
		return array(
			'type' => 'TEXT'
		);
	}

	public static function getDefaultData($settings) {
		return $settings['defaultText'];
	}
}
