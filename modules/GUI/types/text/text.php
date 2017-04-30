<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../GUIType.php';

class SFTypeText extends SFGUIType
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
