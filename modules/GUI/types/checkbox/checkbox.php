<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once ENGINE . 'classes/text.php';

class SFTypeCheckbox extends SFType
{
  public static function getSqlField($params) {
    $params = parseJSON($params);
    $values = [];
    $defaultValue = 0;

    foreach ($params['defaultData'] as $index => $param) {
      if ($param['checked'] == "true") {
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
    $params = json_decode($params, true);
    $params = SFValidate::parse([
      [
        'name' => 'numOptions',
        'type' => 'uzint',
        'require' => true,
        'error' => 'Количество флажков должно быть больше нуля'
      ],
      [
        'name' => 'defaultData',
        'minlength' => 1,
        'error' => 'Не заданы Флажки',
        'array' => [
          [
            'name' => 'label',
            'require' => true,
            'unique' => true,
            'error' => 'Имя флажка должно быть уникальным',
            'skip_row_if_empty' => true
          ],
          [
            'name' => 'checked'
          ]
        ]
      ]
    ], $params);

    return json_encode($params);
  }

  public static function prepareData($field, $data, $section) {
    return $data[$field['alias']];
  }

  public static function getDefaultData($settings) {
    return $settings['defaultData'];
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
