<?php

namespace Engine\Modules\ERM;

use Engine\Classes\Text;

class ERMHelpers {
	public static function getClassNameByType($type) {
		return "\\Engine\\Modules\\ERM\\Types\\Type" . Text::camelCasefy($type, true);
	}

	protected static function sortFields ($fields, & $data) {
		while (true) {
			$find = false;
			$lookingFor = false;
			$needSource = false;
			$mapIndexes = [];

			foreach ($fields as $index => $field) {
				$mapIndexes[$field['alias']] = $index;

				if ($lookingFor && $field['alias'] === $lookingFor) {
					array_splice($fields, $index, 1);
					array_splice($fields, $needSource, 0, array($field));
					$find = true;

					break;
				} else {
					$className = self::getClassNameByType($field['type']);

					if (method_exists($className, 'detectSource') && $className::detectSource($field)) {
						$lookingFor = $className::detectSource($field);
						$data[$field['alias']] = $data[$lookingFor];
						$needSource = $index;

						if (isset($mapIndexes[$lookingFor])) {
							$lookingFor = false;
						}
					}
				}
			}

			if (!$find) break;
		}

		return $fields;
	}
}
