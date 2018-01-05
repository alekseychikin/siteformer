<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiStorages extends SFRouterModel
{
  public static function get ($params = array()) {
    return SFStorages::getStorageList();
  }
}
