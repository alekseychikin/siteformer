<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeString extends SFType
{
  public static function whereExpression($databaseQuery, $section, $field, $value, $params) {
    if (isset($params['find'])) {
      if ($params['find'] === 'prefix') {
        $databaseQuery->where(SFORM::generateValue(':field LIKE ":value%" ', [
          'section' => $section,
          'field' => $field,
          'value' => $value
        ]));
      }
    } else {
      $databaseQuery->where($field, $value);
    }
  }
}
