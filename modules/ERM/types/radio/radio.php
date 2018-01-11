<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeRadio extends SFERMType
{
  public static function getSqlField($params) {
    $defaultValue = $params['defaultValue'];

    return [
      'type' => 'INT(6)',
      'default' => $defaultValue
    ];
  }

  public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
    return SFValidate::value([
      'numOptions' => [
        'type' => 'uzint',
        'required' => true
      ],
      'defaultValue' => [
        'type' => 'int',
        'required' => true
      ],
      'defaultData' => [
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
