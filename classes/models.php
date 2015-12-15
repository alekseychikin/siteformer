<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE.'classes/text.php';

  class SFModels
  {
    public static function factory($model)
    {
      require_once MODELS.$model.'.php';
      $className = 'SF' . SFText::camelCasefy($model, true);
      return new $className;
    }
  }

?>
