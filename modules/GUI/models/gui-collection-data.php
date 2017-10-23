<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiCollectionData extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['id'])) {
      return SFERM::getItem($params['collection'])
        ->where('id', $params['id'])
        ->exec();
    } elseif (isset($params['collection'])) {
      $data = [];
      $collection = SFGUI::getCollection($params['collection']);

      foreach ($collection['fields'] as $field) {
        $className = SFERM::getClassNameByType($field['type']);

        $data[$field['alias']] = '';

        if (class_exists($className)) {
          $data[$field['alias']] = $className::getDefaultData($field['settings']);
        }
      }

      return $data;
    }
  }
}
