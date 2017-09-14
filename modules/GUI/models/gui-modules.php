<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiModules extends SFRouterModel
{
  public static function get ($params) {
    return SFERM::getModules();
  }
}
