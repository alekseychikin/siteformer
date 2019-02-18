<?php

require_once __DIR__ . '/../../../classes/validate.php';
require_once __DIR__ . '/../ERMType.php';

class SFTypeInt extends SFERMType {
  public static $name = 'Число';
  public static $type = 'int';
  public static $requiredable = true;
  public static $settings = [];

  public static function getSqlField($settings) {
    return [
      'type' => 'INT(50)',
      'null' => false,
      'default' => 0
    ];
  }
}
