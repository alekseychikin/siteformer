<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTypeDate extends SFType
{
  public static function getSqlField($params) {
    return [
      'type' => 'DATETIME',
      'default' => false
    ];
  }

  public static function prepareData($field, $data) {

  }
}
