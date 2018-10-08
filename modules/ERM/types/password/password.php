<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypePassword extends SFERMType
{
  public static function prepareInsertData($collection, $field, $data) {
    return md5($data[$field['alias']]);
  }

  public static function whereExpression($collection, $field, $value, $params) {
    if (isset($params['noencode'])) {
      return [$field, $value];
    }

    return [$field, md5($value)];
  }
}
