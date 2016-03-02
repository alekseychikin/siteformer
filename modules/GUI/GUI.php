<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGUI
{
  public static function init($params) {
    $dependencies = ['SFRouter', 'SFTemplater'];
    arrMap($dependencies, function ($dependence) {
      if (!class_exists($dependence)) die('Need module Router before '. $dependence);
    });

    // append types handlers
    $dir = opendir(MODULES . 'GUI/types');

    while($filename = readdir($dir)) {
      if ($filename != '.' && $filename != '..' && is_dir(MODULES . 'GUI/types/' . $filename) && file_exists(MODULES . 'GUI/types/' . $filename . '/' . $filename . '.php')) {
        require_once MODULES . 'GUI/types/' . $filename . '/' . $filename . '.php';
      }
    }

    SFModels::registerPath(MODULES . 'GUI/models');

    SFRouter::addRule('/cms/', MODULES . 'GUI/sections/main/index');
    SFRouter::addRule('/cms/configs/', [
      'data' => [
        'page_title' => 'gui-scalar?value=Настройки',
        'section' => 'gui-scalar?value=configs',
        'sections' => 'gui-sections',
        'modules' => 'gui-modules'
      ],
      'template' => ['sections/configs/index', 'sections/main/main']
    ]);
    SFRouter::addRule('/cms/configs/add/', [
      'data' => [
        'types' => 'gui-types',
        'sections' => 'gui-sections',
        'modules' => 'gui-modules',
        'fields' => 'gui-fields?section=new',
        'section' => 'gui-scalar?value=section',
        'title' => 'gui-scalar?value=',
        'page_title' => 'gui-scalar?value=Добавить раздел',
        'alias' => 'gui-scalar?value=',
        'module' => 'gui-scalar?value=default'
      ],
      'template' => ['sections/configs/add', 'sections/main/main']
    ]);
    SFRouter::addRule('/cms/configs/action_save/', MODULES . 'GUI/sections/configs/action_save');
    SFRouter::addRule('/cms/configs/action_delete/', MODULES . 'GUI/sections/configs/action_delete');
    SFRouter::addRule('/cms/configs/{section}/', [
      'data' => [
        'title' => 'gui-sections?section={section}&field=title',
        'page_title' => 'gui-scalar?value=Редактировать раздел «{title}»',
        'id' => 'gui-sections?section={section}&field=id',
        'alias' => 'gui-sections?section={section}&field=alias',
        'module' => 'gui-sections?section={section}&field=module',
        'fields' => 'gui-fields?section={section}',
        'section' => 'gui-scalar?value=configs',
        'types' => 'gui-types',
        'sections' => 'gui-sections',
        'modules' => 'gui-modules'
      ],
      'template' => ['sections/configs/add', 'sections/main/main']
    ]);
    SFRouter::addRule('/cms/types/{type}/{handle}/', MODULES . 'GUI/sections/main/type');
    SFRouter::addRule('/cms/{section}/', MODULES . 'GUI/sections/item/index');
    SFRouter::addRule('/cms/{section}/add/', [
      'data' => [
        'sections' => 'gui-sections',
        'fields' => 'gui-fields?section={section}',
        'section' => 'gui-sections?section={section}&field=alias',
        'page_title' => 'gui-scalar?value=Добавить раздел'
      ],
      'template' => ['sections/item/add', 'sections/main/main']
    ]);
    SFRouter::addRule('/cms/{section}/action_save/', MODULES . 'GUI/sections/item/action_save');
    SFRouter::addRule('/cms/{section}/{item}/', MODULES . 'GUI/sections/item');

    define('GUI_COMPILE_TEMPLATES', ENGINE . 'temp/modules/GUI/.compile_templates/');
    SFTemplater::compileTemplates(MODULES . 'GUI/', GUI_COMPILE_TEMPLATES);

    if (SFURI::getFirstUri() === 'cms') {
      SFTemplater::setCompilesPath(GUI_COMPILE_TEMPLATES);
    }
  }

  // Get array of sections
  // It could be news or events or galleries
  public static function getSections() {
    return SFORM::select()
      ->from('sections')
      ->order('id desc')
      ->where('enable', 1)
      ->exec();
  }

  // Get section by alias
  public static function getSection($alias) {
    $res = SFORM::select()
      ->from('sections')
      ->join('section_fields')
      ->on('section_fields.section', SFORM::field('sections.id'))
      ->where('sections.alias', $alias)
      ->exec();

    if (count($res)) {
      $res = $res[0];
      $res['fields'] = self::prepareSectionFields($res['section_fields']);
      unset($res['section_fields']);

      return $res;
    } else {
      throw new PageNotFoundException('Section not found');
    }
  }

  // Get section by id
  public static function getSectionById($id) {
    $res = SFORM::select()
      ->from('sections')
      ->join('section_fields')
      ->on('section_fields.section', SFORM::field('sections.id'))
      ->id($id)
      ->exec();
    $res = $res[0];
    $res['fields'] = self::prepareSectionFields($res['section_fields']);
    unset($res['section_fields']);

    return $res;
  }

  public static function getNewFields () {
    $types = self::getTypes();
    list($index, $firstType) = each($types);
    reset($types);

    foreach ($types as $type) {
      if ($type['type'] === 'string') {
        $firstType = $type;
      }
    }

    $fields = array(
      array(
        'title' => '',
        'alias' => '',
        'type' => $firstType['type'],
        'settings' => $firstType['defaultSettings']
      )
    );

    return $fields;
  }

  // Add section
  public static function addSection($data) {
    self::validateSettingsOfData($data);
    $defaultField = [
      'name' => '',
      'type' => '',
      'null' => false,
      'autoincrement' => false,
      'default' => NULL
    ];
    $tableFields = [
      [
        'name' => 'id',
        'type' => 'INT(11) UNSIGNED',
        'null' => false,
        'autoincrement' => true,
        'default' => false
      ],
      [
        'name' => 'status',
        'type' => 'ENUM(\'active\', \'inactive\', \'draft\', \'deleted\')',
        'null' => 'NOT NULL',
        'default' => 'draft'
      ]
    ];

    foreach ($data['fields'] as $field) {
      $fieldType = array_merge($defaultField, self::getSqlFieldType($field));
      $fieldType['name'] = $field['alias'];
      $tableFields[] = $fieldType;
    }

    $data['table'] = self::generateTableNameByAlias($data['alias']);
    $table = SFORM::create($data['table']);

    foreach ($tableFields as $field) {
      $table->addField($field);
    }

    $table->addKey('id', 'primary key');
    $table->exec();
    $idSection = SFORM::insert('sections')
      ->values([
        'title' => $data['title'],
        'alias' => $data['alias'],
        'module' => $data['module'],
        'table' => $data['table']
      ])
      ->exec();
    arrMap($data['fields'], function ($field) use ($idSection) {
      SFORM::insert('section_fields')
        ->values([
          'section' => $idSection,
          'title' => $field['title'],
          'alias' => $field['alias'],
          'type' => $field['type'],
          'settings' => $field['settings']
        ])
        ->exec();
    });

    return $idSection;
  }

  // Save section
  public static function saveSection($id, $data) {
    SFORM::showError();
    $defaultField = [
      'name' => '',
      'type' => '',
      'null' => false,
      'autoincrement' => false,
      'default' => NULL
    ];
    $source = self::getSectionById($id);
    self::validateSettingsOfData($data);

    // prepare source fields and new data fields for get diff
    $dataFields = $data['fields'];
    $sourceFields = $source['fields'];
    $sourceFields = arrSort($sourceFields, function ($a, $b) {
      return $a['id'] < $b['id'];
    });
    $dataFields = arrSort($dataFields, function ($a, $b) {
      return $a['id'] < $b['id'];
    });
    $sourceFields = arrMap($sourceFields, function ($field) {
      unset($field['section']);
      unset($field['title']);
      $field['settings'] = json_encode($field['settings']);

      return $field;
    });
    $dataFields = arrMap($dataFields, function ($field) {
      unset($field['title']);

      return $field;
    });

    // get diff
    $arrDiff = arrDifference($sourceFields, $dataFields);

    foreach ($arrDiff as $field) {
      switch ($field['mark']) {
        case 'edit':
          $fieldType = array_merge($defaultField, self::getSqlFieldType($field['element']));
          $fieldType['name'] = $field['element']['alias'];
          SFORM::alter($source['table'])
            ->change($field['origin']['alias'], $fieldType)
            ->exec();
          break;

        case 'add':
          $fieldType = array_merge($defaultField, self::getSqlFieldType($field['element']));
          $fieldType['name'] = $field['element']['alias'];
          SFORM::alter($source['table'])
            ->add($fieldType)
            ->exec();
          break;

        case 'delete':
          SFORM::alter($source['table'])
            ->drop($field['element']['alias'])
            ->exec();

          break;
      }
    }

    SFORM::update('sections')
      ->values([
        'title' => $data['title'],
        'alias' => $data['alias'],
        'module' => $data['module']
      ])
      ->id($id)
      ->exec();

    $source['fields'] = arrMap($source['fields'], function ($item) {
      $item['settings'] = json_encode($item['settings']);
      unset($item['section']);

      return $item;
    });
    $fields = arrDifference($source['fields'], $data['fields']);

    foreach ($fields as $field) {
      switch($field['mark']) {
        case 'add':
          SFORM::insert('section_fields')
            ->values([
              'section' => $id,
              'title' => $field['element']['title'],
              'alias' => $field['element']['alias'],
              'type' => $field['element']['type'],
              'settings' => $field['element']['settings']
            ])
            ->exec();
          break;

        case 'delete':
          SFORM::delete('section_fields')
            ->id($field['element']['id'])
            ->exec();
          break;

        case 'edit':
          SFORM::update('section_fields')
            ->values([
              'title' => $field['element']['title'],
              'alias' => $field['element']['alias'],
              'type' => $field['element']['type'],
              'settings' => $field['element']['settings']
            ])
            ->id($field['origin']['id'])
            ->exec();
          break;

        case 'skip':
          $fieldType = self::getSqlFieldType($field['element']);
          break;
      }
    }
  }

  // Get array of modules
  // Module is view-type: table or masonry or etc.
  public static function getModules() {
    if (file_exists(MODULES . 'GUI/modules')) {
      $dir = opendir(MODULES . 'GUI/modules');
      $handlers = [];

      while ($subdir = readdir($dir)) {
        if (is_dir(MODULES . 'GUI/modules/' . $subdir) && !in_array($subdir, ['.', '..'])) {
          $handlers[] = $subdir;
        }
      }

      return $handlers;
    }

    return [];
  }

  // Get types for section structure
  public static function getTypes() {
    if (file_exists(MODULES . 'GUI/types')) {
      $dir = opendir(MODULES . 'GUI/types');
      $types = [];

      while ($subdir = readdir($dir)) {
        if (is_dir(MODULES . 'GUI/types/' . $subdir) && !in_array($subdir, ['.', '..'])) {
          if (file_exists(MODULES . 'GUI/types/' . $subdir . '/package.json')) {
            $type = json_decode(file_get_contents(MODULES . 'GUI/types/' . $subdir . '/package.json'), true);
            $type['type'] = $subdir;
            $types[] = $type;
          }
        }
      }

      return $types;
    }

    return [];
  }

  public static function getClassNameByType($type) {
    return 'SFType' . SFText::camelCasefy($type, true);
  }

  private static function stringifyToArray($data, $indent = 1) {
    if (gettype($data) === 'array') {
      $i = 0;
      $isAssoc = false;
      $items = [];

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
    } elseif (gettype($data) === 'integer') {
      return $data;
    } elseif (gettype($data) === 'boolean') {
      return ($data ? 'true' : 'false');
    } elseif (gettype($data) === 'string') {
      return '\'' . $data . '\'';
    }

    return '';
  }

  private static function getIndexString($index) {
    return (is_numeric($index) ? $index : '\'' . $index . '\'');
  }

  private static function getTabsByIndent($indent) {
    $tabs = '';

    for ($i = 0; $i < $indent * 2; $i++) {
      $tabs .= ' ';
    }

    return $tabs;
  }

  private static function getSqlFieldType($field) {
    $className = self::getClassNameByType($field['type']);
    if (class_exists($className)) {
      return $className::getSqlField($field['settings']);
    }

    return false;
  }

  private static function prepareSectionFields($fields) {
    return arrMap($fields, function($field) {
      $field['settings'] = json_decode($field['settings'], true);

      return $field;
    });
  }

  private static function validateSettingsOfData(& $data) {
    foreach ($data['fields'] as $index => $field) {
      $className = self::getClassNameByType($field['type']);

      if (class_exists($className)) {
        $data['fields'][$index]['settings'] = $className::validateSettings($field['settings'], $data['fields'], $field['alias']);
      }
    }
  }

  private static function generateTableNameByAlias($alias) {
    $tableList = SFORMDatabase::getTables();
    $tableName = $alias;
    $i = 1;

    while (in_array($tableName, $tableList)) {
      $tableName = $alias . ($i++);
    }

    return $tableName;
  }
}
