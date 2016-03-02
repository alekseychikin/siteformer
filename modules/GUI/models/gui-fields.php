<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiFields extends SFRouterModel
{
  public static function get ($params) {
    if ($params['section'] === 'new') {
      return SFGUI::getNewFields();
    } else {
      $section = SFGUI::getSection($params['section']);

      return $section['fields'];
    }

    return false;
  }
}
