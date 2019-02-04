<?php

require_once __DIR__ . '/../../../classes/validate.php';
require_once __DIR__ . '/../ERMType.php';

class SFTypeRadio extends SFERMType {
  public static $name = 'Переключатели';
  public static $requiredable = false;
  public static $settings = [
    'checked' => -1,
    'values' => ['']
  ];

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
    return $settings['checked'];
  }
}
