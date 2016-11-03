<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFType
{
  public static function getSqlField($settings) {
    return [
      'type' => 'VARCHAR(250)',
      'null' => 'NULL',
      'default' => ''
    ];
  }

  public static function validateSettings($settings, $fields, $currentAlias) {
    return $settings;
  }

  public static function prepareData($field, $data) {
    return $data[$field['alias']];
  }
}
