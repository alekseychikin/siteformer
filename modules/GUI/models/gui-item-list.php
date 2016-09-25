<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiItemList extends SFRouterModel
{
  public static function get ($params) {
    SFResponse::showContent();
    $section = SFGUI::getSection($params['section']);
    print_r($section);
    return [];
  }
}
