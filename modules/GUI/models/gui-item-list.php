<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiItemList extends SFRouterModel
{
  public static function get ($params) {
    SFResponse::showContent();

    $result = SFGUI::getItemList($params['section'])
      ->order('id desc')
      ->limit(0, 10);

    return $result->exec();
  }
}
