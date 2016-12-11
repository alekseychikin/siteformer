<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTypeDate extends SFType
{
  public static function getSqlField($params) {
    return [
      'type' => 'DATETIME',
      'default' => false
    ];
  }

  public static function prepareInsertData($section, $field, $data) {
    return $data[$field['alias']];
  }

  public static function getDefaultData($settings) {
    $date = [
      'date' => '',
      'time' => ''
    ];

    SFResponse::showContent();

    if ($settings['useCurrentDate']) {
      $date['date'] = date('Y-m-d');
      $date['time'] = date('H:i');
    }

    return $date;
  }

  public static function postProcessData($section, $field, $data) {
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
}
