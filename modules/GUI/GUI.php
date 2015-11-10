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
      SFRouter::addRule('/cms/configs/save/', MODULES . 'GUI/sections/configs/save');
      SFRouter::addRule('/cms/configs/{section}/', MODULES . 'GUI/sections/configs/item');
      SFRouter::addRule('/cms/{section}/', MODULES . 'GUI/sections/module/index');
      SFRouter::addRule('/cms/{section}/{item}/', MODULES . 'GUI/sections/module/item');

      SFTemplater::compileTemplates(MODULES . 'GUI/', TEMP . 'modules/GUI/.compile_templates/');
      SFTemplater::setCompilesPath(TEMP . 'modules/GUI/.compile_templates/');
    }

    // Get array of sections
    // It could be news or events or galleries
    public static function getSections()
    {
      return SFORM::select()
        ->from('sections')
        ->order('id desc')
        ->exec();
    }

    // Get section by alias
    public static function getSection($alias)
    {
      $res = SFORM::select()
        ->from('sections')
        ->join('section_fields', _expr_('section_fields.section', _field_('sections.id')))
        ->where('sections.alias', $alias)
        ->exec();
      $res = $res[0];
      $res['fields'] = self::prepareSectionFields($res['section_fields']);
      unset($res['section_fields']);
      return $res;
    }

    // Get section by id
    public static function getSectionById($id)
    {
      $res = SFORM::select()
        ->from('sections')
        ->join('section_fields', _expr_('section_fields.section', _field_('sections.id')))
        ->id($id)
        ->exec();
      $res = $res[0];
      $res['fields'] = self::prepareSectionFields($res['section_fields']);
      unset($res['section_fields']);
      return $res;
    }

    private static function prepareSectionFields($fields)
    {
      return arrMap($fields, function($field)
      {
        $field['settings'] = json_decode($field['settings'], true);
        return $field;
      });
    }

    // Add section
    public static function addSection($data)
    {
      $idSection = SFORM::insert('sections')
        ->values(array(
          'title' => $data['title'],
          'alias' => $data['alias'],
          'module' => $data['module']
        ))
        ->exec();

      arrMap($data['fields'], function ($field) use ($idSection)
      {
        SFORM::insert('section_fields')
          ->values(array(
            'section' => $idSection,
            'title' => $field['title'],
            'alias' => $field['alias'],
            'type' => $field['type'],
            'settings' => $field['settings']
          ))
          ->exec();
      });
      return $idSection;
    }

    // Save section
    public static function saveSection($id, $data)
    {
      $source = self::getSectionById($id);
      SFORM::update('sections')
        ->values(array(
          'title' => $data['title'],
          'alias' => $data['alias'],
          'module' => $data['module']
        ))
        ->id($id)
        ->exec();
      $source['fields'] = arrMap($source['fields'], function ($item)
      {
        $item['settings'] = json_encode($item['settings']);
        unset($item['section']);
        return $item;
      });
      $fields = arrDifference($source['fields'], $data['fields']);
      foreach ($fields as $field) {
        switch($field['mark']) {
          case 'added':
            SFORM::insert('section_fields')
              ->values(array(
                'section' => $id,
                'title' => $field['element']['title'],
                'alias' => $field['element']['alias'],
                'type' => $field['element']['type'],
                'settings' => $field['element']['settings']
              ))
              ->exec();
            break;
          case 'deleted':
            SFORM::delete('section_fields')
              ->id($field['element']['id'])
              ->exec();
            break;
          case 'edited':
            SFORM::update('section_fields')
              ->values(array(
                'title' => $field['element']['created']['title'],
                'alias' => $field['element']['created']['alias'],
                'type' => $field['element']['created']['type'],
                'settings' => $field['element']['created']['settings']
              ))
              ->id($field['element']['origin']['id'])
              ->exec();
            break;
        }
      }
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
  }

?>
