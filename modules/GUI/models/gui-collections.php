<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiCollections extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['field'])) {
      $collection = SFERM::getCollection($params['collection']);

      return $collection[$params['field']];
    } else {
      return SFERM::getCollections();
    }
  }

  public static function post ($params) {
    $id = false;

    if (isset($params['id'])) {
      $id = (int) $params['id'];
    }

    if (isset($params['delete'])) {
      SFERM::removeCollection($params['delete']);
    } elseif ($id === false) {
      return SFERM::addCollection($params);
    } else {
      unset($params['id']);
      unset($params['alias']);
      SFERM::saveCollection($id, $params);
      return $id;
    }
  }
}
