<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiSections extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['field'])) {
      $section = SFGUI::getSection($params['section']);

      return $section[$params['field']];
    } else {
      return SFGUI::getSections();
    }
  }

  public static function post ($params) {
    $id = false;

    if (isset($params['id'])) {
      $id = (int) $params['id'];
    }

    if (isset($params['delete'])) {
      SFGUI::removeSection($params['delete']);
    } elseif ($id === false) {
      $id = SFGUI::addSection($params);
    } else {
      unset($params['id']);
      SFGUI::saveSection($id, $params);
    }
  }
}
