<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTypeSection extends SFType
{
  public static function getSqlField($params) {
    return [
      'type' => 'INT(11)',
      'default' => false
    ];
  }

  public static function prepareInsertData($section, $field, $data) {
    return $data[$field['alias']];
  }

  public static function validateSettings($settings, $fields, $currentAlias) {
    $settings = json_decode($settings, true);
    $settings = SFValidate::parse([
      [
        'name' => 'section',
        'require' => true,
        'error' => 'Не выбрана секция'
      ],
      [
        'name' => 'field',
        'require' => true,
        'error' => 'Не выбрано поле'
      ]
    ], $settings);
    return json_encode($settings);
  }

  public static function getDefaultData($settings) {
    return [
      'id' => '',
      'title' => ''
    ];
  }

  public static function joinData($databaseQuery, $section, $field) {
    $joinSection = SFGUI::getSection($field['settings']['section']);
    $databaseQuery->join($joinSection['table'])
      ->on($joinSection['table'] . '.id', SFORM::field($section['table'] . '.' . $field['alias']));
  }

  public static function postProcessData($section, $field, $data) {
    $joinSection = SFGUI::getSection($field['settings']['section']);

    foreach ($data as $index => $row) {
      $data[$index][$field['alias']] = [];

      if (isset($row[$joinSection['table']]) && isset($row[$joinSection['table']][0])) {
        $data[$index][$field['alias']] = $row[$joinSection['table']][0];
        unset($data[$index][$joinSection['table']]);
      }
    }

    return $data;
  }
}
