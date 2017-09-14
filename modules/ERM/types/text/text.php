<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeText extends SFERMType
{
  public static function getSqlField($params) {
    return array(
      'type' => 'TEXT'
    );
  }

  public static function getDefaultData($settings) {
    return $settings['defaultText'];
  }
}
