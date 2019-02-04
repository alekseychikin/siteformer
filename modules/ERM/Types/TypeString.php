<?php

require_once __DIR__ . '/../../../classes/validate.php';
require_once __DIR__ . '/../ERMType.php';

class SFTypeString extends SFERMType {
  public static $name = 'Строка';
  public static $requiredable = true;
  public static $settings = [];

  public static function whereExpression($collection, $field, $value, $params) {
    if (isset($params['find'])) {
      if ($params['find'] === 'prefix') {
        return SFORM::generateValue(':field LIKE ":value%" ', [
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
