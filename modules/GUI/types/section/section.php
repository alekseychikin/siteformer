<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../GUIType.php';

class SFTypeSection extends SFGUIType
{
  public static function getSqlField($params) {
    return [
      'type' => 'INT(11)',
      'null' => true,
      'default' => null
    ];
  }

  public static function prepareInsertData($section, $field, $data) {
    if (empty($data[$field['alias']])) {
      return null;
    }

    return $data[$field['alias']];
  }

  public static function prepareUpdateData($section, $field, $currentData, $data) {
    if (empty($data[$field['alias']])) {
      return null;
    }

    return $data[$field['alias']];
  }

  public static function validateSettings($settings, $fields, $currentAlias) {
    return SFValidate::value([
      'section' => [
        'required' => true
      ],
      'field' => [
        'required' => true
      ]
    ], $settings);
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

    if (isset($data[$joinSection['table']]) && isset($data[$joinSection['table']][0])) {
      $data[$field['alias']] = $data[$joinSection['table']][0];
      unset($data[$joinSection['table']]);

      return $data;
    }

    unset($data[$joinSection['table']]);

    $data[$field['alias']] = [
      'title' => '',
      'id' => ''
    ];

    return $data;
  }
}
