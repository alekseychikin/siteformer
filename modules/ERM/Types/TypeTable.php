<?php

require_once __DIR__ . '/../ERMType.php';

class SFTypeTable extends SFERMType {
  public static $name = 'Таблица';
  public static $type = 'table';
  public static $requiredable = false;
  public static $settings = [
    'data' => [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ]
  ];

  public static function getSqlField($params) {
    $defaultData = json_encode($params['defaultData']);

    return array(
      'type' => 'TEXT',
      'default' => $defaultData,
      'null' => false
    );
  }

  public static function getDefaultData($settings) {
    return $settings['defaultData'];
  }

  public static function prepareInsertData($collection, $field, $data) {
    return json_encode($data[$field['alias']], true);
  }

  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    return json_encode($data[$field['alias']], true);
  }

  public static function postProcessData($collection, $field, $data) {
    $data[$field['alias']] = parseJSON($data[$field['alias']]);

    return $data;
  }
}
