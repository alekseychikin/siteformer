<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeSelect extends SFType
{
  public static function getSqlField($params) {
    $params = json_decode($params, true);
    $defaultValue = $params['defaultValue'];

    return [
      'type' => 'INT(6)',
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
        'error' => 'Количество вариантов должно быть больше нуля'
      ],
      [
        'name' => 'defaultValue',
        'require' => true,
        'error' => 'Неизвестное значение по умолчанию'
      ],
      [
        'name' => 'defaultData',
        'minlength' => 1,
        'error' => 'Не заданы Флажки',
        'array' => [
          'require' => true,
          'unique' => true,
          'error' => 'Имя переключателя должно быть уникальным',
          'skip_row_if_empty' => true
        ]
      ]
    ], $params);

    if ($params['defaultValue'] == -1) {
      array_splice($params['defaultData'], 0, 0, "");
    }

    return json_encode($params);
  }

  public static function getDefaultData($settings) {
    return $settings['defaultValue'];
  }
}
