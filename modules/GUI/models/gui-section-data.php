<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiSectionData extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['id'])) {
      return SFGUI::getItem($params['section'])
        ->where('id', $params['id'])
        ->exec();
    } elseif (isset($params['section'])) {
      $data = [];
      $section = SFGUI::getSection($params['section']);

      foreach ($section['fields'] as $field) {
        $className = SFGUI::getClassNameByType($field['type']);

        $data[$field['alias']] = '';

        if (class_exists($className)) {
          $data[$field['alias']] = $className::getDefaultData($field['settings']);
        }
      }

      return $data;
    }
  }
}
