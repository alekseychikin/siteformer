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
}
