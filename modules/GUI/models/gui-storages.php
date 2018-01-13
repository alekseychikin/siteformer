<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiStorages extends SFRouterModel
{
  public static function get ($params = []) {
    if (isset($params['action'])) {
      switch ($params['action']) {
        case 'checkWritablePath':
          $index = [];

          if (isset($params['index'])) {
            $index = explode(',', $params['index']);
          }

          return SFStorages::checkWritablePath($params['storage'], $params['path'], $index);
      }
    }

    return SFStorages::getStorageList();
  }
}
