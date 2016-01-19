<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once __dir__.'/parser/parser_engine.php';
  require_once __dir__.'/parser/php_stringifier.php';
  require_once __dir__.'/parser/js_stringifier.php';

  class SFTemplater
  {
    private static $jsTemplates = array();
    private static $templatePath;
    public static $templateCompilePath;
    private static $lastTemplateCompilePath;
    private static $scripts = array();
    private static $styles = array();
    private static $compileTimes = array();
    private static $controller = false;

    public static function init($params)
    {
      SFLog::write('Init module SFTemplater');
      self::$templatePath = $params['path'];
      self::$templateCompilePath = $params['compile_path'];

      self::compileTemplates(self::$templatePath, self::$templateCompilePath);
    }

    public static function setCompilesPath($compilePath)
    {
      self::$templateCompilePath = $compilePath;
    }

    public static function compileTemplates($templatePath, $compilePath)
    {
      $compileTimes = array();
      if (file_exists($compilePath.'compile_times.php')) {
        $compileTimes = include $compilePath.'compile_times.php';
      }
      $templates = self::recursiveTemplates($templatePath);
      $compileSome = false;
      $i = 1;
      foreach ($templates as $template) {
        if (self::isNeedToCompile($template, $compileTimes, $templatePath, $compilePath)) {
          self::compileTemplate($template, $templatePath, $compilePath);
          self::checkTemplateIsCompiled($template, $templatePath, $compileTimes);
          $compileSome = true;
          $i++;
        }
      }
      if ($compileSome) {
        self::checkAllTemplatesIsCompiled($compilePath, $compileTimes);
      }
    }

    private static function compileTemplate($path, $templates, $compiles)
    {
      $filename = $compiles . substr($path, strlen($templates), -5);
      SFPath::mkdir(dirname($filename));

      $tree = ParserE::parseFile(
        $path,
        array('if', 'else', 'endif', 'elseif', 'for', 'in', 'revertin', 'endfor', 'include', 'require_template', 'controller_page'),
        array()
      );

      $template = PhpStringifier::stringify($tree);

      $file = fopen($filename.'.tmpl.php', 'w');
      if ($file) {
        fputs($file, $template);
        fclose($file);
      }

      $template = JsStringifier::stringify($tree, $filename);

      $file = fopen($filename.'.tmpl.js', 'w');
      if ($file) {
        fputs($file, $template);
        fclose($file);
      }
    }

    private static function isNeedToCompile($templatePath, $compileTimes, $templates, $compiles)
    {
      $templatePath = substr($templatePath, strlen($templates));
      $templatePathCompiled = substr($templatePath, 0, strrpos($templatePath, '.')) . '.tmpl.php';
      if (file_exists($compiles . $templatePathCompiled) && isset($compileTimes[$templatePath])) {
        $timemodify = filectime($templates . $templatePath);
        if ($timemodify == $compileTimes[$templatePath]) {
          return false;
        }
      }
      return true;
    } // isNeedToCompile

    private static function checkTemplateIsCompiled($templatePath, $templates, & $compileTimes)
    {
      $templatePath = substr($templatePath, strlen($templates));
      $compileTimes[$templatePath] = filectime($templates.$templatePath);
    } // checkTemplatesIsCompiled

    private static function checkAllTemplatesIsCompiled($compiles, $compileTimes)
    {
      $text = '<?php if (!defined(\'ROOT\')) die(\'You can\\\'t just open this file, dude\');'.N.'return array(';
      $arrData = array();
      foreach ($compileTimes as $templatePath => $time) {
        $arrData[] = '"'. $templatePath .'" => '.$time;
      }
      $text .= implode(','.N, $arrData);
      $text .= ');'.N.'?>';
      $file = fopen($compiles.'compile_times.php', 'w');
      fputs($file, $text);
      fclose($file);
    } // checkAllTemplatesIsCompiled

    private static function recursiveTemplates($path, $templates = array())
    {
      $dir = opendir($path);
      while ($file = readdir($dir)) {
        if ($file != '.' && $file != '..') {
          if (is_dir($path.$file)) {
            $subTemplates = self::recursiveTemplates($path.$file.'/', $templates);
            $templates = array_merge($templates, $subTemplates);
          }
          else {
            if (substr($file, -5) == '.html') {
              $templates[] = $path.$file;
            }
          }
        }
      }
      return array_unique($templates);
    }

    public static function requireTemplate($template, $item = '', $data = '')
    {
      if (!isset(self::$jsTemplates[$template])) {
        self::$jsTemplates[$template] = array('template' => $template, 'item' => $item, 'data' => $data);
      }
    }

    public static function requireJS($path, $attrs = '')
    {
      self::$scripts[] = array('path' => $path, 'attrs' => $attrs);
    }

    public static function requireCSS($path, $attrs = '')
    {
      self::$styles[] = array('path' => $path);
    }

    public static function requireControllerPage($page)
    {
      self::$controller = $page;
    }

    public static function getJSTemplates()
    {
      $text = '';
      foreach (self::$jsTemplates as $template) {
        $text .= '<script type="text/html" id="template_'.str_replace('/', '_', $template['template']).'"'.stripcslashes($template['data']).'>'.N;
        $content = file_get_contents(self::$templateCompilePath.$template['template'].'.tmpl.js');
        if (!empty($template['item'])) {
          $content = preg_replace('/([^\.\[])' . $template['item'] . '([\.\[])/', '$1', $content);
        }
        $text .= $content;
        $text .= '</script>'.N.N;
      }
      return $text;
    }

    private static function getJSInclude()
    {
      $text = '';
      foreach (self::$scripts as $script) {
        $text .= '<script type="text/javascript" src="'. SFResponse::get('js_path') . $script['path'] .'"'. $script['attrs'] .'></script>'.N;
      }
      return $text;
    }

    private static function getCSSInclude()
    {
      $text = '';
      foreach (self::$styles as $style) {
        $text .= '<link rel="stylesheet" href="'. SFResponse::get('css_path') . $style['path'] .'" />'.N;
      }
      return $text;
    }

    private static function getControllerPage()
    {
      return self::$controller;
    }

    public static function render($template, $main = null, $compilePath = null)
    {
      $content = '';
      if (!$compilePath) $compilePath = self::$templateCompilePath;
      self::$lastTemplateCompilePath = $compilePath;
      if (!empty($template)) {
        ob_start();
        if (file_exists($compilePath . $template . '.tmpl.php')) {
          self::inc($template);
        }
        else {
          ob_end_clean();
          die('template not found: ' . $template . '.tmpl.php');
        }
        $content = ob_get_contents();
        ob_end_clean();
      }
      if ($main) {
        if (file_exists($compilePath . $main . '.tmpl.php')) {
          ob_start();
          self::inc($main, array('content' => $content));
          $content = ob_get_contents();
          ob_end_clean();
          return $content;
        }
        else {
          die('main not found: ' . $main . '.tmpl.php');
        }
      }
      else {
        return $content;
      }
    }

    public static function inc($templatePath, $params = array())
    {
      $results = SFResponse::getResults();
      foreach ($results as $name => $value) {
        $$name = $value;
      }

      foreach ($params as $name => $value) {
        $$name = $value;
      }

      $variables_ = SFResponse::getGlobal();
      $variables = '<script type="text/javascript">';
      foreach ($variables_ as $name => $value) {
        $variables .= 'var ' . $name . ' = ' . json_encode($value, true) . ';'."\n";
      }
      $variables .= '</script>';

      $template_includes = self::getJSTemplates();
      $js_includes = self::getJSInclude();
      $css_includes = self::getCSSInclude();
      $controller = self::getControllerPage();

      include self::$lastTemplateCompilePath . $templatePath . '.tmpl.php';
    }

  }

?>
