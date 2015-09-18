<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFTemplater
  {
    private static $jsTemplates = array();
    private static $templatePath;
    private static $templateCompilePath;
    private static $scripts = array();
    private static $styles = array();
    private static $compileTimes = array();
    private static $controller = false;

    public static function init($params)
    {
      SFLog::write('Init module SFTemplater');
      self::$templatePath = $params['path'];
      self::$templateCompilePath = $params['compile_path'];
      define('TEMPLATES', self::$templatePath);
      define('TEMPLATES_C', self::$templateCompilePath);
      if (file_exists(TEMPLATES_C.'compile_times.php')) {
        self::$compileTimes = include TEMPLATES_C.'compile_times.php';
      }
      foreach ($params as $key => $value) {
        if ($key == 'compile_path' || $key == 'path') continue;
        SFResponse::set($key, $value);
      }

      // $template = "<div>{% if position.categories.sizes[size].bonus != 0 %}</div><div>{% if position.categories.sizes[size].bonus != 0 %}</div>";
      // $regExp = '/{%.*%}/sU';
      // $regExpForVariables = '/(\$[a-zA-Z0-9_]+)(\.[a-zA-Z0-9_]+|\[[a-zA-Z0-9_]+\])+([^a-zA-Z0-9_]?)/s';
      // $regExpForVariables = '/([a-zA-Z0-9_]+)(\.[a-zA-Z0-9_]+|\[[a-zA-Z0-9_]+\])+([^a-zA-Z0-9_]?)/s';
      // if (preg_match_all($regExp, $template, $replaces, PREG_SET_ORDER)) {
      //   foreach ($replaces as $replace) {
      //     $subTemplate = $replace[0];
      //     echo preg_match($regExpForVariables, $subTemplate);
      //   }
      // }


      $templates = self::recursiveTemplates($params['path']);
      foreach ($templates as $templatePath) {
        if (self::isNeedToCompile($templatePath)) {
          self::compileTemplate($templatePath);
          self::checkTemplateIsCompiled($templatePath);
        }
      }
      self::checkAllTemplatesIsCompiled();
      SFLog::write('Inited module SFTemplater');
    }

    private static function isNeedToCompile($templatePath)
    {
      $templatePath = substr($templatePath, strlen(TEMPLATES));
      $templatePathCompiled = substr($templatePath, 0, strrpos($templatePath, '.')).'.php.tmpl';
      if (file_exists(TEMPLATES_C.$templatePathCompiled) && isset(self::$compileTimes[$templatePath])) {
        $timemodify = filectime(TEMPLATES.$templatePath);
        if ($timemodify == self::$compileTimes[$templatePath]) {
          return false;
        }
      }
      return true;
    } // isNeedToCompile

    private static function checkTemplateIsCompiled($templatePath)
    {
      $templatePath = substr($templatePath, strlen(TEMPLATES));
      self::$compileTimes[$templatePath] = filectime(TEMPLATES.$templatePath);
    } // checkTemplatesIsCompiled

    private static function checkAllTemplatesIsCompiled()
    {
      $text = '<?php if (!defined(\'ROOT\')) die(\'You can\\\'t just open this file, dude\');'.N.'return array(';
      $arrData = array();
      foreach (self::$compileTimes as $templatePath => $time) {
        $arrData[] = '"'. $templatePath .'" => '.$time;
      }
      $text .= implode(','.N, $arrData);
      $text .= ');'.N.'?>';
      $file = fopen(TEMPLATES_C.'compile_times.php', 'w');
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
        $content = file_get_contents(TEMPLATES_C.$template['template'].'.js.tmpl');
        if (!empty($template['item'])) {
          $content = str_replace($template['item'] .'.', '', $content);
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
      // print_r(self::$jsTemplates);
      foreach (self::$styles as $style) {
//				echo TEMPLATES_C.$template.N;
        $text .= '<link rel="stylesheet" href="'. SFResponse::get('css_path') . $style['path'] .'" />'.N;
      }
      return $text;
    }

    private static function getControllerPage()
    {
      return self::$controller;
    }

    private static function compileTemplate($path)
    {
      $template = file_get_contents($path);
      $templateReplace = $template;

      $templateReplace = self::compileTemplatePHP($templateReplace);

      $filename = TEMPLATES_C.substr($path, strlen(TEMPLATES), -5);
      SFPath::mkdir(dirname($filename));
      $file = fopen($filename.'.php.tmpl', 'w');
      if ($file) {
        fputs($file, '<!-- '.substr($filename, strlen(TEMPLATES_C)).' -->'.N.$templateReplace.N.'<!-- \\\\'.substr($filename, strlen(TEMPLATES_C)).' -->'.N);
        fclose($file);
      }

      $templateReplace = self::compileTemplateJS($template);

      $file = fopen($filename.'.js.tmpl', 'w');
      if ($file) {
        fputs($file, $templateReplace);
        fclose($file);
      }
    }

    private static function compileTemplatePHP($template)
    {
      $arrStrings = array();
      // replace strings to marks
      $regExpForVariables = '/{%([^\'"{%]*("|\')([^"\']+)\2[^\'"%}]*)+(%}|}})/sU';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replaceTemplate = $replace[0];
          preg_match_all('/["\'][^\'"]+[\'"]/s', $subTemplate, $strings);
          foreach ($strings[0] as $string) {
            $replaceTemplate = str_replace($string, '{~string'.count($arrStrings).'~}', $replaceTemplate);
            $arrStrings[] = $string;
          }
          $template = str_replace($subTemplate, $replaceTemplate, $template);
        }
      }

      // replace string to $string
      $regExpForVariables = '/{[{%].*?[%}]}/s';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replace = preg_replace('/([\(\)!\?\s\+\-\{\]\[])([a-zA-Z0-9_]+)/s', '$1$$2', $subTemplate);
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      // replace `" . string` to `" . $string`
      $regExpForVariables = '/{[{%].*?[%}]}/s';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          // print_r($subTemplate);
          $replace = preg_replace('/(~}\s*\.\s*)([a-zA-Z0-9_]+)/s', '$1$$2', $subTemplate);
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      // replace string? to isset(string)
      $regExpForVariables = '/{%.*%}/sU';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replace = preg_replace('/([$a-zA-Z0-9_\.\[\]\'"\(\)]+)\?/s', ' isset($1) ', $subTemplate);
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      //
      $regExpForVariables = '/{[{%].*([(!\s\+\-]?)([a-zA-Z0-9_]+).*[%}]}/sU';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replace = preg_replace('/([(!\s\+\-])([a-zA-Z0-9_]+)/s', '$1$$2', $subTemplate);
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      $regExpForVariables = '/{[{%].*([(!\s\+\-]?)([a-zA-Z0-9_]+).*[%}]}/sU';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $arrexpr = '/\[([a-zA-Z0-9_]+[a-zA-Z0-9_]*((\.[a-zA-Z0-9_]+[^a-zA-Z0-9_\.]*|\[[a-zA-Z0-9_]+[^a-zA-Z0-9_\]\.]*\]))*)\.\.([a-zA-Z0-9_]+[a-zA-Z0-9_]*((\.[a-zA-Z0-9_]+[^a-zA-Z0-9_\.]*|\[[a-zA-Z0-9_]+[^a-zA-Z0-9_\[\.]*\]))*)\]/s';
          if (preg_match($arrexpr, $subTemplate, $replace_)) {
            $start = $replace_[1];
            $end = $replace_[4];

            $subelementexp = '/\[([a-zA-Z0-9_]+[^a-zA-Z0-9_\]\.]*)\]/s';
            while (preg_match($subelementexp, $start, $res)) {
              $start = preg_replace($subelementexp, '[\$$1]', $start);
            }
            $subelementexp = '/\.([a-zA-Z0-9_]+[^a-zA-Z0-9_\.\[]*)/s';
            while (preg_match($subelementexp, $start, $res)) {
              $start = preg_replace($subelementexp, '[\'$1\']', $start);
            }

            $subelementexp = '/\[([a-zA-Z0-9_]+[^a-zA-Z0-9_\]\.]*)\]/s';
            while (preg_match($subelementexp, $end, $res)) {
              $end = preg_replace($subelementexp, '[\$$1]', $end);
            }
            $subelementexp = '/\.([a-zA-Z0-9_]+[^a-zA-Z0-9_\.\[]*)/s';
            while (preg_match($subelementexp, $end, $res)) {
              $end = preg_replace($subelementexp, '[\'$1\']', $end);
            }

            $replace = preg_replace($arrexpr, 'makeArray('.(!preg_match('/^\d+$/', $start) ? '$' : '').$start.', '.(!preg_match('/^\d+$/', $end) ? '$' : '').$end.')', $subTemplate);
            $template = str_replace($subTemplate, $replace, $template);
          }
        }
      }

      // echo ($template)."\n\n\n\n";
      //
      $regExpForVariables = '/(\$[a-zA-Z0-9_]+)(\.[a-zA-Z0-9_]+|\[\$[a-zA-Z0-9_]+\])+([^a-zA-Z0-9_]?)/s';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          // echo $subTemplate."\n";
          $subelementexp = '/\.([a-zA-Z0-9_]+)([^a-zA-Z0-9_]?)/s';
          $replace = $subTemplate;
          // echo $replace."\n\n";
          while (preg_match($subelementexp, $replace, $res)) {
            $replace = preg_replace($subelementexp, '[\'$1\']$2', $replace);
          }
          $subelementexp = '/\[([a-zA-Z0-9_]+)\]/s';
          while (preg_match($subelementexp, $replace, $res)) {
            $replace = preg_replace($subelementexp, '[\$$1]', $replace);
          }
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      // replace $method to method
      $regExpForVariables = '/(\$[a-zA-Z0-9_]+)/';
      if (preg_match_all($regExpForVariables, $template, $replaces, PREG_SET_ORDER)) {
        $exclussion = array('increment', 'by', 'endinc', 'if', 'else', 'elseif', 'endif', 'for', 'endfor', 'in', 'revertin', 'include', 'item', 'isset', 'empty', 'require_js', 'require_css', 'require_template', 'controller_page', 'array');
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replace = str_replace('$', '', $subTemplate);
          if (in_array($replace, $exclussion) || function_exists($replace) || class_exists($replace) || preg_match('/^\d+$/', $replace)) {
            // $template = str_replace($subTemplate, $replace, $template);
            $varregexp = '/(\\'.$subTemplate.')([^a-zA-Z0-9_])/';
            $template = preg_replace($varregexp, $replace.'$2', $template);
          }
        }
      }
      $template = str_replace('$data-$', 'data-', $template);

      foreach ($arrStrings as $index => $item) {
        $template = str_replace('{~string'.$index.'~}', $item, $template);
      }

      $replaceRegExp = '/{%\s*require_template\s*[\'"]([a-zA-Z0-9\-\/_\.]+)[\'"](\s+item=[\'"]([a-zA-Z_\-]+)[\'"])?((\s+data\-[a-zA-Z_\-]+=["\'][a-zA-Z\-_\s0-9]+["\'])*)\s*%}/sU';
      if (preg_match_all($replaceRegExp, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $path_ = $replace[1];
          $item = (isset($replace[3]) ? $replace[3] : '');
          $data = (isset($replace[4]) ? $replace[4] : '');
          $template = str_replace($subTemplate, '<?php SFTemplater::requireTemplate("'. $path_ .'", "'. $item .'", "'. $data .'");?>', $template);
          // echo $templateReplace;
        }
      }

      $requireCSSRegExp = '/{%\s*require_css\s+[\'"]([a-zA-Z0-9\-\/_\.]+)[\'"]([^%]*)\s*%}/sU';
      if (preg_match_all($requireCSSRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php SFTemplater::requireCSS("'. $template_[1]. '", "'. addslashes($template_[2]). '"); ?>', $template);
        }
      }

      $requireJSRegExp = '/{%\s*require_js\s+[\'"]([a-zA-Z0-9\-\/_\.]+)[\'"]([^%]*)\s*%}/sU';
      if (preg_match_all($requireJSRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php SFTemplater::requireJS("'. $template_[1]. '", "'. addslashes($template_[2]). '"); ?>', $template);
        }
      }

      $requireJSRegExp = '/{%\s*controller_page\s+[\'"]([a-zA-Z0-9\-\/_\.]+)[\'"]\s*%}/sU';
      if (preg_match_all($requireJSRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php SFTemplater::requireControllerPage("'. $template_[1]. '"); ?>', $template);
        }
      }

      $includeRegExp = '/{%\s*include\s+[\'"]([a-zA-Z0-9\-\/_\.]+)[\'"]\s*%}/sU';
      if (preg_match_all($includeRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php include TEMPLATES_C.\''.$template_[1].'.php.tmpl\' ?>', $template);
        }
      }

      $includeRegExp = '/{%\s*increment\s+\$([a-zA-Z0-9\-\/_\.]+)\s+by\s+\$([a-zA-Z0-9\-\/_\.]+)\s*%}/sU';
      if (preg_match_all($includeRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php $'.$template_[1].' = -1; while ( $'.$template_[1].' < $'.$template_[2].' - 1) { $'.$template_[1].'++; ?>', $template);
        }
      }

      $forRexExp = '/{%\s*for\s+(([\$a-zA-Z0-9_\.]+),\s*)?([\$a-zA-Z0-9_\.]+)\s+(revertin|in)\s+([\$a-zA-Z0-9\(\)_\.,\s\[\]\'\"]+)\s*%}/sU';
      if (preg_match_all($forRexExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          if (!empty($template_[2])) {
            if ($template_[4] == 'in') {
              $template = str_replace($template_[0], '<?php foreach ('.$template_[5].' as '.$template_[2].' => '.$template_[3].') { ?>', $template);
            }
            else {
              $template = str_replace($template_[0], '<?php '.$template_[5].' = array_reverse('.$template_[5].', true); foreach ('.$template_[5].' as '.$template_[2].' => '.$template_[3].') { ?>', $template);
            }
          }
          else {
            if ($template_[4] == 'in') {
              $template = str_replace($template_[0], '<?php foreach ('.$template_[5].' as '.$template_[3].') { ?>', $template);
            }
            else {
              $template = str_replace($template_[0], '<?php '.$template_[5].' = array_reverse('.$template_[5].', true); foreach ('.$template_[5].' as '.$template_[3].') { ?>', $template);
            }
          }
        }
      }

      $ifRegExp = '/{%\s*if\s+(.*)\s*%}/sU';
      if (preg_match_all($ifRegExp, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $subelementexp = '/([a-zA-Z0-9_$]+)\s+in\s+([$a-zA-Z0-9_\.\'"\[\]]+)/s';
          $replace = $subTemplate;
          while (preg_match($subelementexp, $replace, $res)) {
            $var = substr($res[1], 1);
            $replace = preg_replace($subelementexp, 'isset($2[\''.$var.'\'])', $replace);
          }
          $template = str_replace($subTemplate, $replace, $template);
        }
      }

      $assignmentRegExp = '/{%\s*([\$a-zA-Z0-9_\.\-\[\]\'\"]+)\s*=\s*([^%}]+)\s*%}/sU';
      if (preg_match_all($assignmentRegExp, $template, $pregTemplates, PREG_SET_ORDER)) {
        foreach ($pregTemplates as $template_) {
          $template = str_replace($template_[0], '<?php '.$template_[1].' = '.$template_[2].'; ?>', $template);
        }
      }
      /*$template = preg_replace($forRexExp, '<?php foreach ($2 as $1) { ?>', $template);*/
      $template = preg_replace('/{%\s*for\s+([\$a-zA-Z0-9_\.]+)\s+revertin\s+([\$a-zA-Z0-9_\.\[\]\'\"]+)\s*%}/sU', '<?php $2 = array_reverse($2, true); foreach ($2 as $1) { ?>', $template);
      $template = preg_replace('/{%\s*endfor\s*%}/sU', '<?php } ?>', $template);

      $template = preg_replace('/{%\s*log\s*(.*)\s*%}/sU', '<?php print_r( $1 ); ?>', $template);
      $template = preg_replace('/{%\s*if\s+(.*)\s*%}/sU', '<?php if ( $1 ) { ?>', $template);
      $template = preg_replace('/{%\s*else\s*%}/sU', '<?php } else { ?>', $template);
      $template = preg_replace('/{%\s*elseif\s+(.*)\s*%}/sU', '<?php } elseif ( $1 ) { ?>', $template);
      $template = preg_replace('/{%\s*endif\s*%}/sU', '<?php } ?>', $template);
      $template = preg_replace('/{%\s*endinc\s*%}/sU', '<?php } ?>', $template);

      $echoRegexp = '/{{(~?)\s*([\$\(\)\*\+\-\/a-zA-Z0-9_\.,\'\"\[\]\s]+)(\??)(\|([a-zA-Z_]+))?\s*}}/';
      if (preg_match_all($echoRegexp, $template, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $res = '<?php ';
          if ($replace[3] == '?') {
            $res .= 'if (isset(' . $replace[2] . ')) ';
          }
          $res .= 'echo ';
          if ($replace[1] == '~') {
            $res .= 'htmlspecialchars(';
          }
          if (isset($replace[5])) {
            $res .= $replace[5].'(';
          }
          $res .= $replace[2];
          if (isset($replace[5])) {
            $res .= ')';
          }
          if ($replace[1] == '~') {
            $res .= ')';
          }
          $res .= '; ?>';
          $template = str_replace($replace[0], $res, $template);
        }
      }
      // echo $template;
      return $template;
    }

    private static function compileTemplateJS($template)
    {
      $templateReplace = $template;

      $regExpForVariables = '/{%.*?%}/s';
      if (preg_match_all($regExpForVariables, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          if (strpos($replace[0], '?') === false) continue;
          $subTemplate = $replace[0];
          $replace = preg_replace('/([$a-zA-Z0-9_\.\[\]\'"\(\)]+)\?/s', '( obj.$1 != undefined && obj.$1.toString().length )', $subTemplate);
          $templateReplace = str_replace($subTemplate, $replace, $templateReplace);
        }
      }

      $regExpForVariables = '/{%.*%}/sU';
      if (preg_match_all($regExpForVariables, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $replace = preg_replace('/([\'\"])\s*\.\s*/', '$1 + ', $subTemplate);
          $replace = preg_replace('/\s*\.\s*([\'\"])/', ' + $1', $replace);
          $templateReplace = str_replace($subTemplate, $replace, $templateReplace);
        }
      }

      $regExpForVariables = '/{%.*%}/sU';
      if (preg_match_all($regExpForVariables, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $arrexpr = '/\[([a-zA-Z0-9_]+[a-zA-Z0-9_]*((\.[a-zA-Z0-9_]+[^a-zA-Z0-9_\.]*|\[[a-zA-Z0-9_]+[^a-zA-Z0-9_\]\.]*\]))*)\.\.([a-zA-Z0-9_]+[a-zA-Z0-9_]*((\.[a-zA-Z0-9_]+[^a-zA-Z0-9_\.]*|\[[a-zA-Z0-9_]+[^a-zA-Z0-9_\[\.]*\]))*)\]/s';
          if (preg_match($arrexpr, $subTemplate, $replace_)) {
            $start = $replace_[1];
            $end = $replace_[4];

            $replace = preg_replace($arrexpr, '(function (start, end) {var _arr = []; for (var i = parseInt(start, 10); i <= parseInt(end, 10); i+=1) _arr.push(i); return _arr;})('.$start.', '.$end.')', $subTemplate);
            $templateReplace = str_replace($subTemplate, $replace, $templateReplace);
          }
        }
      }

      $assignmentRegExp = '/{%\s*([\$a-zA-Z0-9_\.\-\[\]\'\"]+)\s*=\s*([^%}]+)\s*%}/sU';
      if (preg_match_all($assignmentRegExp, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $templateReplace = str_replace($replace[0], '<% '.$replace[1].' = '.$replace[2].'; %>', $templateReplace);
        }
      }

      $ifRegExp = '/{%\s*if\s+(.*)\s*%}/sU';
      if (preg_match_all($ifRegExp, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $subTemplate = $replace[0];
          $subelementexp = '/([a-zA-Z0-9_$]+)\s+in\s+([$a-zA-Z0-9_\.\'"\[\]]+)/s';
          $replace = $subTemplate;
          while (preg_match($subelementexp, $replace, $res)) {
            $replace = preg_replace($subelementexp, '(\'$1\' in $2)', $replace);
          }
          $templateReplace = str_replace($subTemplate, $replace, $templateReplace);
        }
      }

      $templateReplace = preg_replace('/{%\s*for\s+([a-zA-Z0-9_\.]+)\s+in\s+([a-zA-Z0-9_\.\s\[\]\(\);=\+\-,\{\}<>]+)\s*%}/sU', '<% (function () { var _arr = $2; for ($1 in _arr) { %><% $1 = _arr[$1]; %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*for\s+([a-zA-Z0-9_\.]+)\s*,\s*([a-zA-Z0-9_\.]+)\s+in\s+([a-zA-Z0-9_\.]+)\s*%}/sU', '<% (function () { var _arr = $3; for ($1 in _arr) { %><% $2 = _arr[$1]; %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*endfor\s*%}/sU', '<% } })(); %>', $templateReplace);

      $templateReplace = preg_replace('/{%\s*log\s*(.+)\s*%}/sU', '<% console.log($1); %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*if\s+(.+)\s*%}/sU', '<% if ( $1 ) { %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*else\s*%}/sU', '<% } else { %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*elseif\s+(.+)\s*%}/sU', '<% } else if ( $1 ) { %>', $templateReplace);
      $templateReplace = preg_replace('/{%\s*endif\s*%}/sU', '<% } %>', $templateReplace);

      $echoRegexp = '/{{(~?)\s*([\$\(\)\*\+\-a-zA-Z0-9_\.,\'\"\[\]\s]+)(\??)(\|([a-zA-Z_]+))?\s*}}/';
      if (preg_match_all($echoRegexp, $templateReplace, $replaces, PREG_SET_ORDER)) {
        foreach ($replaces as $replace) {
          $res = '<%= ';
          if ($replace[1] == '~') {
            $res .= ' escapeHtml(';
          }
          if (isset($replace[5])) {
            $res .= 'window.'.$replace[5].'(';
          }
          if ($replace[3] == '?') {
            $res .= '(obj.' . $replace[2] . ' || window.' . $replace[2] . ' || \'\')';
          }
          else {
            $res .= $replace[2];
          }
          if (isset($replace[5])) {
            $res .= ')';
          }
          if ($replace[1] == '~') {
            $res .= ')';
          }
          $res .= ' %>';
          $templateReplace = str_replace($replace[0], $res, $templateReplace);
        }
      }

      $templateReplace = preg_replace('/{{\s*([^\s][a-zA-Z0-9\(\)_\.\s\+\-\*\/]+)\s*}}/sU', '<%= $1 %>', $templateReplace);
      $templateReplace = preg_replace('/{{\s*([^\s][a-zA-Z0-9\(\)_\.\s\+\-\*\/]+)\?\s*}}/sU', '<%= obj.$1 || window.$1 || \'\' %>', $templateReplace);
      return $templateReplace;
    }

    public static function render($template, $main = '')
    {
      $results = SFResponse::getResults();
      foreach ($results as $name => $content) {
        $$name = $content;
      }
      $content = '';
      if (!empty($template)) {
        ob_start();
        if (file_exists(TEMPLATES_C.$template.'.php.tmpl')) {
          include TEMPLATES_C.$template.'.php.tmpl';
        }
        else {
          ob_end_clean();
          die('template not found: '.$template.'.php.tmpl');
        }
        $content = ob_get_contents();
        ob_end_clean();
      }

      $template_includes = self::getJSTemplates();
      $js_includes = self::getJSInclude();
      $css_includes = self::getCSSInclude();
      $controller = self::getControllerPage();
      $variables_ = SFResponse::getGlobal();
      $variables = '<script type="text/javascript">';
      foreach ($variables_ as $name => $value) {
        $variables .= 'var ' . $name . ' = ' . json_encode($value, true) . ';'."\n";
      }
      $variables .= '</script>';

      if ($main) {
        if (file_exists(TEMPLATES_C.$main.'.php.tmpl')) {
          ob_start();
          include TEMPLATES_C.$main.'.php.tmpl';
          $content = ob_get_contents();
          ob_end_clean();
          return $content;
        }
        else {
          die('main not found: '.$main.'.php.tmpl');
        }
      }
      else {
        return $content;
      }
    }

  }

  function makeArray($start, $end)
  {
    $arr = array();
    $start = str_replace(',', '.', $start);
    $end = str_replace(',', '.', $end);
    settype($start, 'integer');
    settype($end, 'integer');
    for ($i = $start; $i <= $end; $i++) {
      $arr[] = $i;
    }
    return $arr;
  }

?>
