<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ERMGetItem.php';
require_once __DIR__ . '/ERMGetItemList.php';

class SFERM
{
  private static $collections = [];

  public static function init($params = []) {
    self::checkTables();

    // append types handlers
    $dir = opendir(MODULES . 'ERM/types');

    while ($filename = readdir($dir)) {
      $dirname = MODULES . 'ERM/types/' . $filename;
      $isDir = is_dir($dirname);
      $isFileExists = file_exists($dirname . '/' . $filename . '.php');
      if ($filename != '.' && $filename != '..' && $isDir && $isFileExists) {
        require_once MODULES . 'ERM/types/' . $filename . '/' . $filename . '.php';

        $className = self::getClassNameByType($filename);

        if (method_exists($className, 'prepareDatabase')) {
          $className::prepareDatabase();
        }
      }
    }
  }

  public static function getItemList($collection) {
    return new SFERMGetItemList($collection);
  }

  public static function getItem($collection) {
    return new SFERMGetItem($collection);
  }

  public static function createItem ($collection, $params) {
    $data = $params['data'];
    $status = $params['status'];
    $newData = [
      'status' => $params['status'],
      'usercreate' => $params['user'],
      'datecreate' => gmdate('Y-m-d H:i:s')
    ];
    $collection = self::getCollection($collection);
    $fields = self::sortFields($collection['fields'], $data);

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::validateInsertData($collection['alias'], $field, $data);
    }

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);

      if ($className::hasSqlField()) {
        $newData[$field['alias']] = $className::prepareInsertData($collection['alias'], $field, $data);
      }
    }

    if ($status === 'public') {
      foreach ($fields as $field) {
        if ($field['required'] === true && (empty($newData[$field['alias']]))) {
          throw new ValidateException([
            'index' => [$field['alias']],
            'code' => 'EEMPTYREQUIREDVALUE'
          ]);
        }
      }
    }

    $record = SFORM::insert($collection['table'])
      ->values($newData)
      ->exec('default', true);

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::postPrepareInsertData($collection, $field, $record, $data);
    }
  }

  public static function updateItem($collection, $params) {
    $id = $params['id'];
    $data = $params['data'];
    $status = $params['status'];
    $newData = [
      'id' => $id,
      'status' => $status,
      'usermodify' => $params['user'],
      'datemodify' => gmdate('Y-m-d H:i:s')
    ];
    $collection = SFERM::getCollection($collection);
    $fields = self::sortFields($collection['fields'], $data);

    $currentData = SFERM::getItem($collection['alias'])
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::validateUpdateData($collection['alias'], $field, $currentData, $data);
    }

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);

      if ($className::hasSqlField()) {
        $newData[$field['alias']] = $className::prepareUpdateData($collection['alias'], $field, $currentData, $data);
      }
    }

    if ($status === 'public') {
      foreach ($fields as $field) {
        if ($field['required'] === true && (empty($newData[$field['alias']]))) {
          throw new ValidateException([
            'index' => [$field['alias']],
            'code' => 'EEMPTYREQUIREDVALUE'
          ]);
        }
      }
    }

    $record = SFORM::update($collection['table'])
      ->values($newData)
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::postPrepareUpdateData($collection, $field, $newData, $data);
    }

    return $id;
  }

  // Get array of collections
  // It could be news or events or galleries
  public static function getCollections() {
    $res = SFORM::select()
      ->from('sys_collections')
      ->join('sys_collection_fields')
      ->on('sys_collection_fields.collection', SFORM::field('sys_collections.id'))
      ->order('sys_collections.id desc')
      ->where('sys_collections.enable', true)
      ->exec();

    if (count($res)) {
      $res = arrMap($res, function ($item) {
        $item['fields'] = self::prepareCollectionFields($item['sys_collection_fields']);
        unset($item['sys_collection_fields']);

        return $item;
      });
    }

    return $res;
  }

  // Get collection by alias
  public static function getCollection($alias, $force = false) {
    if (isset(self::$collections[$alias]) && !$force) {
      return self::$collections[$alias];
    }

    $res = SFORM::select()
      ->from('sys_collections')
      ->join('sys_collection_fields')
      ->on('sys_collection_fields.collection', SFORM::field('sys_collections.id'))
      ->where('sys_collections.alias', $alias)
      ->andWhere('sys_collections.enable', true)
      ->exec();

    if (count($res)) {
      $res = $res[0];
      $res['fields'] = self::prepareCollectionFields($res['sys_collection_fields']);
      unset($res['sys_collection_fields']);

      self::$collections[$alias] = $res;
      self::$collections[$res['id']] = $res;

      return $res;
    }

    return false;
  }

  // Get collection by id
  public static function getCollectionById($id) {
    $res = SFORM::select()
      ->from('sys_collections')
      ->join('sys_collection_fields')
      ->on('sys_collection_fields.collection', SFORM::field('sys_collections.id'))
      ->where('id', $id)
      ->andWhere('sys_collections.enable', true)
      ->exec();

    if (count($res)) {
      $res = $res[0];
      $res['fields'] = self::prepareCollectionFields($res['sys_collection_fields']);
      unset($res['sys_collection_fields']);

      self::$collections[$id] = $res;
      self::$collections[$res['alias']] = $res;

      return $res;
    }

    return false;
  }

  // Add collection
  public static function addCollection($data) {
    $modules = self::getModules();
    $modules[] = 'default';

    $types = arrMap(self::getTypes(), function ($type) use (& $types) {
      return $type['type'];
    });

    $index = 1;

    $data = SFValidate::value([
      'title' => [
        'required' => true,
        'unique' => function ($value) {
          $res = SFORM::select()
            ->from('sys_collections')
            ->where('title', $value)
            ->andWhere('enable', true);

          return !$res->length();
        }
      ],
      'alias' => [
        'required' => true,
        'valid' => '/^[a-zA-Z\-_]+$/i',
        'unique' => function ($value) {
          $res = SFORM::select()
            ->from('sys_collections')
            ->where('alias', $value)
            ->andWhere('enable', true);

          return !$res->length();
        }
      ],
      'fields' => [
        'minlength' => 1,
        'collection' => [
          'id' => [
            'required' => false,
            'default' => 0,
            'valid' => '/^\d+$/'
          ],
          'title' => [
            'required' => true,
            'unique' => true
          ],
          'alias' => [
            'required' => true,
            'unique' => true,
            'valid' => '/^[a-zA-Z0-9\-_]+$/i'
          ],
          'type' => [
            'values' => $types
          ],
          'required' => [
            'default' => 'false',
            'modify' => function ($value) {
              if (is_numeric($value)) {
                return $value ? 'true' : 'false';
              }

              return $value;
            }
          ],
          'settings' => [
            'type' => 'array',
            'modify' => function ($settings) {
              return json_encode($settings);
            }
          ],
          'position' => [
            'default' => function () use (& $index) {
              return $index++;
            }
          ]
        ]
      ]
    ], $data);

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
        'type' => 'ENUM(\'public\', \'draft\', \'deleted\')',
        'null' => 'NOT NULL',
        'default' => 'draft'
      ],
      [
        'name' => 'datecreate',
        'type' => 'DATETIME',
        'null' => true,
        'default' => null
      ],
      [
        'name' => 'datemodify',
        'type' => 'DATETIME',
        'null' => true,
        'default' => null
      ],
      [
        'name' => 'usercreate',
        'type' => 'INT(4)',
        'null' => true,
        'default' => null
      ],
      [
        'name' => 'usermodify',
        'type' => 'INT(4)',
        'null' => true,
        'default' => null
      ]
    ];

    foreach ($data['fields'] as $field) {
      $className = self::getClassNameByType($field['type']);

      if ($className::hasSqlField()) {
        $fieldType = array_merge($defaultField, self::getSqlFieldType($field));
        $fieldType['name'] = $field['alias'];
        $tableFields[] = $fieldType;
      }
    }

    $data['table'] = self::generateTableNameByAlias($data['alias']);
    $table = SFORM::create($data['table']);

    foreach ($tableFields as $field) {
      $table->addField($field);
    }

    $table->addKey('id', 'primary key');
    $table->exec();

    $idCollection = SFORM::insert('sys_collections')
      ->values([
        'title' => $data['title'],
        'alias' => $data['alias'],
        'table' => $data['table']
      ])
      ->exec();

    arrMap($data['fields'], function ($field) use ($idCollection) {
      SFORM::insert('sys_collection_fields')
        ->values([
          'collection' => $idCollection,
          'title' => $field['title'],
          'alias' => $field['alias'],
          'type' => $field['type'],
          'required' => $field['required'],
          'settings' => $field['settings'],
          'position' => $field['position']
        ])
        ->exec();
    });

    return $idCollection;
  }

  // Save collection
  public static function saveCollection($id, $data) {
    $modules = self::getModules();
    $modules[] = 'default';

    $types = arrMap(self::getTypes(), function ($type) {
      return $type['type'];
    });

    $data = SFValidate::value([
      'title' => [
        'required' => true,
        'unique' => function ($value) use ($id) {
          $res = SFORM::select()
            ->from('sys_collections')
            ->where('title', $value)
            ->andWhere('enable', true);

          if ($id !== false) {
            $res = $res->andWhere('id', '!=', $id);
          }

          return !$res->length();
        }
      ],
      'alias' => [
        'required' => true,
        'valid' => '/^[a-zA-Z\-_]+$/i',
        'unique' => function ($value) use ($id) {
          $res = SFORM::select()
            ->from('sys_collections')
            ->where('alias', $value)
            ->andWhere('enable', true);

          if ($id !== false) {
            $res = $res->andWhere('id', '!=', $id);
          }

          return !$res->length();
        }
      ],
      'fields' => [
        'minlength' => 1,
        'collection' => [
          'id' => [
            'valid' => '/^\d+$/',
            'default' => 0
          ],
          'title' => [
            'required' => true,
            'unique' => true
          ],
          'alias' => [
            'required' => true,
            'unique' => true,
            'valid' => '/^[a-zA-Z0-9\-_]+$/i'
          ],
          'type' => [
            'values' => $types
          ],
          'required' => [],
          'settings' => [
            'type' => 'array',
            'modify' => function ($settings) {
              return json_encode($settings);
            }
          ],
          'position' => [
            'valid' => '/^\d+$/',
            'unique' => true
          ]
        ]
      ]
    ], $data);

    $defaultField = [
      'name' => '',
      'type' => '',
      'null' => false,
      'autoincrement' => false,
      'default' => NULL
    ];

    $source = self::getCollectionById($id);
    self::validateSettingsOfData($data);

    // prepare source fields and new data fields for get diff
    $source['fields'] = arrMap(arrSort($source['fields'], function ($a, $b) {
      return $a['id'] < $b['id'];
    }), function ($field) {
      $field['position'] = (int)$field['position'];

      return $field;
    });

    $index = 0;

    $data['fields'] = arrMap(arrSort($data['fields'], function ($a, $b) {
      return $a['position'] < $b['position'];
    }), function ($field) use (& $index) {
      $field['position'] = $index++;

      return $field;
    });

    $data['fields'] = arrSort($data['fields'], function ($a, $b) {
      return $a['id'] < $b['id'] && strlen($a['id']) && strlen($b['id']);
    });

    $dataFields = $data['fields'];
    $sourceFields = $source['fields'];

    $sourceFields = arrMap($sourceFields, function ($field) {
      unset($field['collection']);
      unset($field['title']);
      $field['settings'] = json_encode($field['settings']);
      $field['position'] = (int)$field['position'];

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
        case 'delete':
          SFORM::alter($source['table'])
            ->dropField($field['element']['alias'])
            ->exec();

          break;
      }
    }

    foreach ($arrDiff as $field) {
      switch ($field['mark']) {
        case 'edit':
          $fieldType = array_merge($defaultField, self::getSqlFieldType($field['element']));
          $fieldType['name'] = $field['element']['alias'];
          SFORM::alter($source['table'])
            ->changeField($field['origin']['alias'], $fieldType)
            ->exec();

          break;
      }
    }

    foreach ($arrDiff as $field) {
      switch ($field['mark']) {
        case 'add':
          $fieldType = array_merge($defaultField, self::getSqlFieldType($field['element']));
          $fieldType['name'] = $field['element']['alias'];
          SFORM::alter($source['table'])
            ->addField($fieldType)
            ->exec();

          break;
      }
    }

    SFORM::update('sys_collections')
      ->values([
        'title' => $data['title'],
        'module' => $data['module']
      ])
      ->id($id)
      ->exec();

    $sourceFields = arrMap($source['fields'], function ($item) {
      $item['settings'] = json_encode($item['settings']);
      unset($item['collection']);

      return $item;
    });

    $fields = arrDifference($sourceFields, $data['fields']);

    foreach ($fields as $field) {
      switch($field['mark']) {
        case 'add':
          SFORM::insert('sys_collection_fields')
            ->values([
              'collection' => $id,
              'title' => $field['element']['title'],
              'alias' => $field['element']['alias'],
              'type' => $field['element']['type'],
              'required' => $field['element']['required'],
              'settings' => $field['element']['settings'],
              'position' => $field['element']['position']
            ])
            ->exec();

          break;
        case 'delete':
          SFORM::delete('sys_collection_fields')
            ->id($field['element']['id'])
            ->exec();

          break;
        case 'edit':
          SFORM::update('sys_collection_fields')
            ->values([
              'title' => $field['element']['title'],
              'alias' => $field['element']['alias'],
              'type' => $field['element']['type'],
              'required' => $field['element']['required'],
              'settings' => $field['element']['settings'],
              'position' => $field['element']['position']
            ])
            ->id($field['origin']['id'])
            ->exec();

          break;
        case 'skip':
          $fieldType = self::getSqlFieldType($field['element']);

          break;
      }
    }

    $collection = self::getCollectionById($id);
    SFResponse::set('fields', $collection['fields']);
  }

  // Get types for collection structure
  public static function getTypes() {
    if (file_exists(MODULES . 'ERM/types')) {
      $dir = opendir(MODULES . 'ERM/types');
      $types = [];

      while ($subdir = readdir($dir)) {
        if (is_dir(MODULES . 'ERM/types/' . $subdir) && !in_array($subdir, ['.', '..'])) {
          if (file_exists(MODULES . 'ERM/types/' . $subdir . '/configs.json')) {
            $type = parseJSON(file_get_contents(MODULES . 'ERM/types/' . $subdir . '/configs.json'));
            $type['type'] = $subdir;
            $types[] = $type;
          }
        }
      }

      return $types;
    }

    return [];
  }

  public static function removeCollection($id) {
    $request = SFORM::update('sys_collections')
      ->values([
        'enable' => false
      ])
      ->where('id', $id)
      ->exec();
  }

  // Get array of modules
  // Module is view-type: table or masonry or etc.
  public static function getModules() {
    if (file_exists(MODULES . 'ERM/modules')) {
      $dir = opendir(MODULES . 'ERM/modules');
      $handlers = [];

      while ($subdir = readdir($dir)) {
        if (is_dir(MODULES . 'ERM/modules/' . $subdir) && !in_array($subdir, ['.', '..'])) {
          $handlers[] = $subdir;
        }
      }

      return $handlers;
    }

    return [];
  }

  private static function getSqlFieldType($field) {
    $className = self::getClassNameByType($field['type']);

    if (class_exists($className)) {
      return $className::getSqlField(parseJSON($field['settings']));
    }

    return false;
  }

  private static function prepareCollectionFields($fields) {
    return arrSort(arrMap($fields, function($field) {
      $field['settings'] = parseJSON($field['settings']);

      return $field;
    }), function ($a, $b) {
      return $a['position'] < $b['position'];
    });
  }

  private static function validateSettingsOfData(& $data) {
    foreach ($data['fields'] as $index => $field) {
      $className = self::getClassNameByType($field['type']);

      if (class_exists($className)) {
        $settings = parseJSON($field['settings']);
        $validatedSettings = $className::validateSettings($settings, $data['fields'], $field['alias'], ['fields', $index, 'settings']);
        $data['fields'][$index]['settings'] = json_encode($validatedSettings);
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

  private static function checkTables() {
    if (!SFORM::exists('sys_collections')) {
      SFORM::create('sys_collections')
        ->addField([
          'name' => 'id',
          'type' => 'INT(11) UNSIGNED',
          'autoincrement' => true
        ])
        ->addField([
          'name' => 'title',
          'type' => 'VARCHAR(150)'
        ])
        ->addField([
          'name' => 'alias',
          'type' => 'VARCHAR(150)'
        ])
        ->addField([
          'name' => 'table',
          'type' => 'VARCHAR(120)'
        ])
        ->addField([
          'name' => 'enable',
          'type' => 'enum("false","true")',
          'default' => 'true'
        ])
        ->addKey('id', 'PRIMARY KEY')
        ->addKey('alias', 'KEY')
        ->exec();
    }

    if (!SFORM::exists('sys_collection_fields')) {
      SFORM::create('sys_collection_fields')
        ->addField([
          'name' => 'id',
          'type' => 'INT(11) UNSIGNED',
          'autoincrement' => true,
          'null' => false
        ])
        ->addField([
          'name' => 'collection',
          'type' => 'INT(11) UNSIGNED',
          'null' => true,
          'default' => NULL
        ])
        ->addField([
          'name' => 'title',
          'type' => 'VARCHAR(60)',
          'null' => false
        ])
        ->addField([
          'name' => 'alias',
          'type' => 'VARCHAR(60)',
          'null' => false
        ])
        ->addField([
          'name' => 'type',
          'type' => 'VARCHAR(20)',
          'null' => false
        ])
        ->addField([
          'name' => 'required',
          'type' => 'ENUM("false","true")',
          'default' => 'false'
        ])
        ->addField([
          'name' => 'settings',
          'type' => 'TEXT'
        ])
        ->addField([
          'name' => 'position',
          'type' => 'INT(3)',
          'null' => false,
          'default' => 0
        ])
        ->addKey('id', 'primary key')
        ->addKey('position')
        ->addKey('collection')
        ->addKey('alias')
        ->exec();
    }
  }

  public static function getClassNameByType($type) {
    return 'SFType' . SFText::camelCasefy($type, true);
  }

  private static function sortFields ($fields, & $data) {
    while (true) {
      $find = false;
      $lookingFor = false;
      $needSource = false;
      $mapIndexes = [];

      foreach ($fields as $index => $field) {
        $mapIndexes[$field['alias']] = $index;

        if ($lookingFor && $field['alias'] === $lookingFor) {
          array_splice($fields, $index, 1);
          array_splice($fields, $needSource, 0, array($field));
          $find = true;

          break;
        } else {
          $className = self::getClassNameByType($field['type']);

          if (method_exists($className, 'detectSource') && $className::detectSource($field)) {
            $lookingFor = $className::detectSource($field);
            $data[$field['alias']] = $data[$lookingFor];
            $needSource = $index;

            if (isset($mapIndexes[$lookingFor])) {
              $lookingFor = false;
            }
          }
        }
      }

      if (!$find) break;
    }

    return $fields;
  }
}
