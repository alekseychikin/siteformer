<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeSelect extends SFERMType
{
  public static function getSqlField($params) {
    return [
      'type' => 'INT(6)',
      'default' => $params['checked']
    ];
  }

  public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
    return SFValidate::value([
      'checked' => [
        'type' => 'int'
      ],
      'values' => [
        'minlength' => 1,
        'collection' => [
          'required' => true,
          'unique' => true,
          'skipempty' => true
        ]
      ]
    ], $settings, $indexes);
  }

  public static function getDefaultData($settings) {
    return $settings['defaultValue'];
  }
}
