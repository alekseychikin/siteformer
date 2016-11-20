<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiFields extends SFRouterModel
{
  public static function get ($params) {
    if ($params['section'] === 'new') {
      return SFGUI::getNewFields();
    } else {
      $section = SFGUI::getSection($params['section']);

      if (isset($params['limit'])) {
        $fields = arrSort($section['fields'], function ($item1, $item2) {
          return $item1['position'] < $item2['position'];
        });

        return array_slice($fields, 0, $params['limit']);
      }

      return $section['fields'];
    }

    return false;
  }
}
