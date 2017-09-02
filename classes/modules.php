<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFModules
  {
    private static $actionsPath;
    private static $modules = ['Router'];
    private static $modulesRegisters = array();
    private static $environment = 'default';

    public static function main() {
      $find = false;

      foreach (self::$modules as $module) {
        ob_start();

        if (method_exists('SF' . $module, 'main')) {
          $find = call_user_func(array('SF' . $module, 'main'));
        }

        $content = trim(ob_get_contents());
        ob_end_clean();

        if ($find) {
          echo $content;

          break;
        }
      }

      return $find;
    }
  }
