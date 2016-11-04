<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTypeSection extends SFType
{
  public static function getSqlField($params) {
    return [
      'type' => 'INT(11)',
      'default' => false
    ];
  }

  public static function prepareData($field, $data) {
    return $data[$field['alias']];
  }

  public static function validateSettings($settings, $fields, $currentAlias) {
    return $settings;
  }

  public static function getDefaultData($settings) {
    return [
      'id' => '',
      'title' => ''
    ];
  }
}
