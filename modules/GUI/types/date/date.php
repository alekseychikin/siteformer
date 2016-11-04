<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTypeDate extends SFType
{
  public static function getSqlField($params) {
    return [
      'type' => 'DATETIME',
      'default' => false
    ];
  }

  public static function prepareData($field, $data) {
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
}
