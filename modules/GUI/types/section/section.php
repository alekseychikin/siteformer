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
    $settings = json_decode($settings, true);
    $settings = SFValidate::parse([
      [
        'name' => 'section',
        'require' => true,
        'error' => 'Не выбрана секция'
      ],
      [
        'name' => 'field',
        'require' => true,
        'error' => 'Не выбрано поле'
      ]
    ], $settings);
    return json_encode($settings);
  }

  public static function getDefaultData($settings) {
    return [
      'id' => '',
      'title' => ''
    ];
  }
}
