<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFModules
  {
    private static $actionsPath;
    private static $modules = array();
    private static $modulesRegisters = array();
    private static $environment = 'default';

    public static function register()
    {
      if (func_num_args() == 2) {
        $environment = 'default';
        $domains = false;
        $actionsPath = func_get_arg(0);
        $modules = func_get_arg(1);
      }
      else if (func_num_args() == 3) {
        $environment = 'default';
        $domains = func_get_arg(0);
        $actionsPath = func_get_arg(1);
        $modules = func_get_arg(2);
      }
      else if (func_num_args() == 4) {
        $environment = func_get_arg(0);
        $domains = func_get_arg(1);
        $actionsPath = func_get_arg(2);
        $modules = func_get_arg(3);
      }
      self::$modulesRegisters[] = array(
        'environment' => $environment,
        'domains' => $domains,
        'actions' => $actionsPath,
        'modules' => $modules
      );
      // print_r(func_get_args());
    }

    public static function inc($module, $params = array())
    {
      $modulePath = MODULES.$module.'/';
      if (!file_exists($modulePath)) die('Not exists module path ('.$module.'): '.$modulePath);
      require_once $modulePath.$module.'.php';
      call_user_func(array('SF'.$module, 'init'), $params);
    }

    public static function getEnvironment()
    {
      return self::$environment;
    }

    public static function checkModules()
    {
      $host = $_SERVER['HTTP_HOST'];
      $isFoundSet = false;
      foreach (self::$modulesRegisters as $setModule) {
        if ($setModule['domains'] !== false && (
          gettype($setModule['domains']) == 'array' && in_array($host, $setModule['domains']) ||
          gettype($setModule['domains']) == 'string' && $host == $setModule['domains']
        )) {
          self::$environment = $setModule['environment'];
          $actionsPath = $setModule['actions'];
          $modules = $setModule['modules'];
          $isFoundSet = true;
          break;
        }
      }
      if (!$isFoundSet) {
        foreach (self::$modulesRegisters as $setModule) {
          if ($setModule['domains'] === false) {
            $actionsPath = $setModule['actions'];
            $modules = $setModule['modules'];
            $isFoundSet = true;
            break;
          }
        }
      }
      if (!$isFoundSet) die('Didnt find any config set for this domain');
      self::$actionsPath = $actionsPath;
      define('ACTIONS', self::$actionsPath);
      if (!file_exists($actionsPath)) die('Not exists actions path: '.$actionsPath);
      foreach ($modules as $module) {
        $modulePath = MODULES.$module[0].'/';
        if (!file_exists($modulePath)) die('Not exists module path ('.$module[0].'): '.$modulePath);
        // echo $modulePath.$module[0].'.php'."\n";
        require_once $modulePath.$module[0].'.php';
        self::$modules[] = $module[0];
        call_user_func(array('SF'.$module[0], 'init'), $module[1]);
      }
    } // checkModules

    public static function before()
    {
      foreach (self::$modules as $module) {
        if (method_exists('SF'.$module, '__before')) {
          call_user_func(array('SF'.$module, '__before'));
        }
      }
    }

    public static function after()
    {
      foreach (self::$modules as $module) {
        if (method_exists('SF'.$module, '__after')) {
          call_user_func(array('SF'.$module, '__after'));
        }
      }
    }
  }
