<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTemplater
{
  private static $jsTemplates = [];
  public static $templatesPath;
  private static $scripts = [];
  private static $styles = [];
  private static $compileTimes = [];
  private static $controller = false;

  public static function init($params) {
    self::$templatesPath = $params['path'];
  }

  public static function setCompilesPath($compilePath) {
    self::$templatesPath = $compilePath;
  }

  public static function render($template, $data = [], $compilePath = null) {
    $content = '';

    if (!$compilePath) $compilePath = self::$templatesPath;

    if (!empty($template)) {
      ob_start();

      $path = pathresolve($compilePath, $template);

      if (extname($path) !== '.php') {
        $path .= '.php';
      }

      if (file_exists($path)) {
        $templateRender = include ($path);
        echo $templateRender($data);
      } else {
        ob_end_clean();
        die('template not found: ' . $path);
      }

      $content = ob_get_contents();
      ob_end_clean();
    }

    if (strpos($content, '<!DOCTYPE') !== false) {
      return substr($content, strpos($content, '<!DOCTYPE'));
    }

    return $content;
  }
}
