<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypePassword extends SFType
{
  public static function prepareData($field, $data) {
    return md5($data[$field['alias']]);
  }
}
