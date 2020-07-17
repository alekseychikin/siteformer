<?php

namespace Engine\Modules\ERM\Types;

use Engine\Modules\ERM\ERMType;
use Engine\Modules\ORM\ORM;

class TypeString extends ERMType {
	public static $name = 'Строка';
	public static $type = 'string';
	public static $requiredable = true;
	public static $settings = [];

	public static function whereExpression($collection, $field, $value, $params) {
		if (isset($params['find'])) {
			if ($params['find'] === 'prefix') {
				return ORM::generateValue(':field LIKE ":value%" ', [
					'collection' => $collection,
					'field' => $field,
					'value' => $value
				]);
			}
		} else {
			return [$field, $value];
		}
	}
}
