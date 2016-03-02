<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiScalar extends SFRouterModel
{
  public static function get ($params) {
    return $params['value'];
  }
}
