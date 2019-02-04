<?php

require_once __DIR__ . '/../../../classes/validate.php';
require_once __DIR__ . '/../ERMType.php';

class SFTypeText extends SFERMType {
  public static $name = 'Текст';
  public static $requiredable = true;
  public static $settings = [
    'text' => ''
  ];

  public static function getSqlField($params) {
    return array(
      'type' => 'TEXT'
    );
  }

  public static function getDefaultData($settings) {
    return $settings['defaultText'];
  }
}
