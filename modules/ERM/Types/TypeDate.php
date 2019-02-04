<?php

require_once __DIR__ . '/../ERMType.php';

class SFTypeDate extends SFERMType {
  public static $name = 'Дата';
  public static $requiredable = true;
  public static $settings = [
    'useTime' => false,
    'useCurrentDate' => false
  ];

  public static function getSqlField($params) {
    return [
      'type' => 'DATETIME',
      'null' => true,
      'default' => null
    ];
  }

  public static function prepareInsertData($collection, $field, $data) {
    $value = $data[$field['alias']];

    if (empty($value)) {
      return NULL;
    }

    return $value;
  }

  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    $value = $data[$field['alias']];

    if (empty($value)) {
      return NULL;
    }

    return $value;
  }

  public static function getDefaultData($settings) {
    $date = [
      'date' => '',
      'time' => ''
    ];

    if ($settings['useCurrentDate']) {
      $date['date'] = date('Y-m-d');
      $date['time'] = date('H:i');
    }

    return $date;
  }

  public static function postProcessData($collection, $field, $data) {
    $date = $data[$field['alias']];

    if (preg_match('/^(\d{4}\-\d{2}\-\d{2})\s(\d{2}:\d{2}):\d{2}$/', $date, $out)) {
      $date = explode(' ', $date);

      $data[$field['alias']] = [
        'date' => $out[1],
        'time' => $out[2]
      ];

      return $data;
    }

    $data[$field['alias']] = [
      'date' => '',
      'time' => ''
    ];

    return $data;
  }

  public static function whereExpression($collection, $field, $value, $params = false) {
    if ($params !== false) {
      return [$field, $params, $value];
    }

    return [$field, $value];
  }
}
