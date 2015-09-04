<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFModels
  {
    private static function preparePath($modelPath)
    {
      $separate = array('-', '_');

      foreach ($separate as $sepword) {
        $res = explode($sepword, $modelPath);
        foreach ($res as $index => $word) {
          $res[$index] = strtoupper(substr($word, 0, 1)) . substr($word, 1);
        }
        $modelPath = implode('', $res);
      }

      return 'SF'.$modelPath;
    }

    public static function factory($model)
    {
      require_once MODELS.$model.'.php';
      $className = self::preparePath($model);
      return new $className;
    }
  }

?>
