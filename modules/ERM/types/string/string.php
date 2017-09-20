<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeString extends SFERMType
{
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
