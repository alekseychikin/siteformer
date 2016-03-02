<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE.'classes/text.php';

  class SFModels
  {
    private static $paths = [];

    public static function factory($model)
    {
      $path = explode('/', $model);
      require_once ACTIONS . $model . '.php';
      $model = $path[count($path) - 1];
      $className = 'SF' . SFText::camelCasefy($model, true);
      return new $className;
    }

    public static function registerPath ($path) {
      self::$paths[] = SFPath::prepareDir($path);
    }

    public static function get ($model, $params) {
      $path = explode('/', $model);
      $finded = false;

      foreach (self::$paths as $pathItem) {
        if (file_exists($pathItem . $model . '.php')) {
          require_once $pathItem . $model . '.php';

          $model = $path[count($path) - 1];
          $className = 'SF' . SFText::camelCasefy($model, true);

          return call_user_func([$className, 'get'], $params);
        }
      }

      return false;
    }
  }

?>
