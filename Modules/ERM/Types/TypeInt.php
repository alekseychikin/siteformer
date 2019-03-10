<?php

namespace Engine\Modules\ERM\Types;

use \Engine\Modules\ERM\ERMType;

class TypeInt extends ERMType {
	public static $name = 'Число';
	public static $type = 'int';
	public static $requiredable = true;
	public static $settings = [];

	public static function getSqlField($settings) {
		return [
			'type' => 'INT(50)',
			'null' => false,
			'default' => 0
		];
	}
}
