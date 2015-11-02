<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFGUI
  {
    public static function init($params)
    {
      $dependencies = array('SFRouter', 'SFTemplater');
      arrMap($dependencies, function ($dependence)
      {
        if (!class_exists($dependence)) die('Need module Router before '. $dependence);
      });
      SFRouter::addRule('/cms/', MODULES . 'GUI/sections/main/index');
      SFRouter::addRule('/cms/configs/', MODULES . 'GUI/sections/configs/index');
      SFRouter::addRule('/cms/configs/add/', MODULES . 'GUI/sections/configs/add');
      SFRouter::addRule('/cms/configs/data/fields/', MODULES . 'GUI/sections/configs/data/fields');
      SFRouter::addRule('/cms/configs/{section}/', MODULES . 'GUI/sections/configs/item');
      SFRouter::addRule('/cms/{section}/', MODULES . 'GUI/sections/module/index');
      SFRouter::addRule('/cms/{section}/{item}/', MODULES . 'GUI/sections/module/item');

      SFTemplater::compileTemplates(MODULES . 'GUI/', TEMP . 'modules/GUI/.compile_templates/');
      SFTemplater::setCompilesPath(TEMP . 'modules/GUI/.compile_templates/');
    }

    // Get array of sections
    public static function getSections()
    {
      if (!file_exists(CONFIGS . 'modules/GUI/sections.php')) {
        self::saveSections(array());
        return array();
      }
      return include CONFIGS . 'modules/GUI/sections.php';
    }

    private static function saveSections($sections)
    {
      $content = '<?php if (!defined(\'ROOT\')) die(\'You can\\\'t just open this file, dude\');' . N;
      $content .= 'return ' . self::stringifyToArray($sections) . ';' . N;
      SFPath::mkdir(CONFIGS . 'modules/GUI');
      $configFile = fopen(CONFIGS . 'modules/GUI/sections.php', 'w');
      fputs($configFile, $content);
      fclose($configFile);
    }

    private static function stringifyToArray($data, $indent = 1)
    {
      if (gettype($data) === 'array') {
        $i = 0;
        $isAssoc = false;
        $items = array();
        foreach ($data as $index => $item) {
          if ($index !== $i) {
            $isAssoc = true;
            break;
          }
          $i++;
        }
        foreach ($data as $index => $item) {
          $items[] = self::getTabsByIndent($indent) . ($isAssoc ? self::getIndexString($index) . ' => ' : '') . self::stringifyToArray($item, $indent + 1);
        }
        return 'array(' . N . implode(',' . N, $items) . N . self::getTabsByIndent($indent - 1) . ')';
      }
      elseif (gettype($data) === 'integer') {
        return $data;
      }
      elseif (gettype($data) === 'boolean') {
        return ($data ? 'true' : 'false');
      }
      elseif (gettype($data) === 'string') {
        return '\'' . $data . '\'';
      }
      return '';
    }

    private static function getIndexString($index)
    {
      return (is_numeric($index) ? $index : '\'' . $index . '\'');
    }

    private static function getTabsByIndent($indent)
    {
      $tabs = '';
      for ($i = 0; $i < $indent * 2; $i++) {
        $tabs .= ' ';
      }
      return $tabs;
    }

    // Get array of modules
    // Module is view-type: table or masonry or etc.
    public static function getModules()
    {
      if (file_exists(MODULES . 'GUI/modules')) {
        $dir = opendir(MODULES . 'GUI/modules');
        $handlers = array();
        while ($subdir = readdir($dir)) {
          if (is_dir(MODULES . 'GUI/modules/' . $subdir) && !in_array($subdir, array('.', '..'))) {
            $handlers[] = $subdir;
          }
        }
        return $handlers;
      }
      return array();
    }

    // Get types for section structure
    public static function getTypes()
    {
      if (file_exists(MODULES . 'GUI/types')) {
        $dir = opendir(MODULES . 'GUI/types');
        $types = array();
        while ($subdir = readdir($dir)) {
          if (is_dir(MODULES . 'GUI/types/' . $subdir) && !in_array($subdir, array('.', '..'))) {
            if (file_exists(MODULES . 'GUI/types/' . $subdir . '/package.json')) {
              $type = json_decode(file_get_contents(MODULES . 'GUI/types/' . $subdir . '/package.json'), true);
              $type['alias'] = $subdir;
              $types[] = $type;
            }
          }
        }
        return $types;
      }
      return array();
    }
  }

?>
