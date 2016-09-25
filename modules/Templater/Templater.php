<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFTemplater
{
  private static $jsTemplates = [];
  private static $templatePath;
  public static $templateCompilePath;
  private static $lastTemplateCompilePath;
  private static $scripts = [];
  private static $styles = [];
  private static $compileTimes = [];
  private static $controller = false;

  public static function init($params) {
    SFLog::write('Init module SFTemplater');
    self::$templatePath = $params['path'];
    self::$templateCompilePath = $params['compile_path'];
  }

  public static function setCompilesPath($compilePath) {
    self::$templateCompilePath = $compilePath;
  }

  public static function render($template, $data = [], $compilePath = null) {
    $content = '';

    if (!$compilePath) $compilePath = self::$templateCompilePath;

    self::$lastTemplateCompilePath = $compilePath;

    if (!empty($template)) {
      ob_start();

      if (file_exists($compilePath . $template . '.php')) {
        $templateRender = include ($compilePath . $template . '.php');
        echo $templateRender($data);
      } else {
        ob_end_clean();
        die('template not found: ' . $compilePath . $template . '.php');
      }

      $content = ob_get_contents();
      ob_end_clean();
    }

    return $content;
  }
}
