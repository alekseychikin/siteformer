<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeText extends SFType
{
  public static function getSqlField($params)
  {
    return array(
      'type' => 'TEXT'
    );
  }
}
