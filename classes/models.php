<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE.'classes/text.php';

  class SFModels
  {
    public static function factory($model)
    {
      $path = explode('/', $model);
      require_once ACTIONS . $model . '.php';
      $model = $path[count($path) - 1];
      $className = 'SF' . SFText::camelCasefy($model, true);
      return new $className;
    }
  }

?>
