<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFERMTypes extends SFRouterModel
{
  public static function get ($params) {
    return SFGUI::getTypes();
  }
}
