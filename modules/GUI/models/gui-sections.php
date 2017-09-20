<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiCollections extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['field'])) {
      $collection = SFGUI::getCollection($params['collection']);

      return $collection[$params['field']];
    } else {
      return SFGUI::getCollections();
    }
  }

  public static function post ($params) {
    $id = false;

    if (isset($params['id'])) {
      $id = (int) $params['id'];
    }

    if (isset($params['delete'])) {
      SFGUI::removeCollection($params['delete']);
    } elseif ($id === false) {
      return SFGUI::addCollection($params);
    } else {
      unset($params['id']);
      SFGUI::saveCollection($id, $params);
      return $id;
    }
  }
}
