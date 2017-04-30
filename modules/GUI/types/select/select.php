<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../GUIType.php';

class SFTypeSelect extends SFGUIType
{
  public static function getSqlField($params) {
    return [
      'type' => 'INT(6)',
      'default' => $params['defaultValue']
    ];
  }

  public static function validateSettings($params, $fields, $currentAlias) {
    $params = SFValidate::value([
      'numOptions' => [
        'type' => 'uzint',
        'required' => true
      ],
      'defaultValue' => [
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
    ], $params);

    if ($params['defaultValue'] == -1) {
      array_splice($params['defaultData'], 0, 0, "");
    }

    return $params;
  }

  public static function getDefaultData($settings) {
    return $settings['defaultValue'];
  }
}
