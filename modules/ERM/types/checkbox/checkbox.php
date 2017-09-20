<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once ENGINE . 'classes/text.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeCheckbox extends SFERMType
{
  public static function getSqlField($params) {
    $values = [];
    $defaultValue = 0;

    foreach ($params['values'] as $index => $param) {
      if ($param['checked'] === true) {
        $defaultValue |= 1 << $index;
      }
    }

    return [
      'type' => 'INT(60)',
      'default' => $defaultValue
    ];
  }

  public static function validateSettings($params, $fields, $currentAlias) {
    return SFValidate::value([
      'values' => [
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

  public static function prepareInsertData($collection, $field, $data) {
    if (gettype($data[$field['alias']]) === 'integer') return 1 << $data[$field['alias']];

    $value = 0;

    foreach ($data[$field['alias']] as $item) {
      $value |= 1 << $item;
    }

    return $value;
  }

  public static function getDefaultData($settings) {
    $data = 0;

    foreach ($settings['values'] as $index => $field) {
      if ($field['checked']) {
        $data |= 1 << $index;
      }
    }

    return $data;
  }

  public static function prepareDataForEditForm($value, $settings) {
    $data = [];

    foreach ($settings['values'] as $index => $row) {
      $data[] = [
        'label' => $row['label'],
        'checked' => $index & $value
      ];
    }

    return $data;
  }

  public static function whereExpression($collection, $field, $value, $params = false) {
    $insertions = [];
    $options = [
      'collection' => $collection,
      'field' => $field
    ];

    foreach ($value as $index => $item) {
      $insertions[] = ':field & :value' . $index;
      $options['value' . $index] = 1 << $item;
    }

    $joinStr = ' AND ';

    if ($params !== false) {
      if ($params === 'any') {
        $joinStr = ' OR ';
      }
    }

    return SFORM::generateValue(implode($joinStr, $insertions), $options);
  }
}
