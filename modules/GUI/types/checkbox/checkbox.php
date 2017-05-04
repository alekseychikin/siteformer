<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once ENGINE . 'classes/text.php';
require_once __DIR__ . '/../../GUIType.php';

class SFTypeCheckbox extends SFGUIType
{
  public static function getSqlField($params) {
    $values = [];
    $defaultValue = 0;

    foreach ($params['defaultData'] as $index => $param) {
      if ($param['checked'] === true) {
        $defaultValue |= 1 << $index;
      }
    }

    SFResponse::showContent();

    return [
      'type' => 'INT(60)',
      'default' => $defaultValue
    ];
  }

  public static function validateSettings($params, $fields, $currentAlias) {
    return SFValidate::value([
      'numOptions' => [
        'type' => 'uzint',
        'required' => true
      ],
      'defaultData' => [
        'minlength' => 1,
        'collection' => [
          'label' => [
            'required' => true,
            'unique' => true,
            'skipempty' => true
          ],
          'checked' => []
        ]
      ]
    ], $params);
  }

  public static function prepareInsertData($section, $field, $data) {
    return $data[$field['alias']];
  }

  public static function getDefaultData($settings) {
    $data = 0;

    foreach ($settings['defaultData'] as $index => $field) {
      if ($field['checked']) {
        $data |= 1 << $index;
      }
    }

    return $data;
  }

  public static function prepareDataForEditForm($value, $settings) {
    $data = [];

    foreach ($settings['defaultData'] as $index => $row) {
      $data[] = [
        'label' => $row['label'],
        'checked' => $index & $value
      ];
    }

    return $data;
  }
}
