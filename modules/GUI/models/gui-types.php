<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiTypes extends SFRouterModel
{
  public static function get ($params) {
    return SFERM::getTypes();
  }
}
