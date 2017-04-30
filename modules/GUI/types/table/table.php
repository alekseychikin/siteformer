<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../GUIType.php';

class SFTypeTable extends SFGUIType
{
  public static function getSqlField($params) {
    $params = json_decode($params, true);
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

  public static function prepareInsertData($section, $field, $data) {
    return json_encode($data[$field['alias']], true);
  }

  public static function postProcessData($section, $field, $data) {
    $data[$field['alias']] = parseJSON($data[$field['alias']]);

    return $data;
  }
}
