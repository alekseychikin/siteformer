<?php

namespace Engine\Modules\ERM;

use \Engine\Classes\Validate;
use \Engine\Classes\Response;
use \Engine\Modules\ORM\ORM;
use \Engine\Modules\ORM\ORMDatabase;

class ERM extends ERMHelpers {
	private static $collections = [];

	public static function init($params = []) {
		self::createTables();
		$types = self::getTypes();

		foreach ($types as $type) {
			if (
				class_exists($type['className']) &&
				method_exists($type['className'], 'prepareDatabase')
			) {
				return $type['className']::prepareDatabase();
			}
		}
	}

	public static function getItemList($collection) {
		return new ERMGetItemList($collection);
	}

	public static function getItem($collection) {
		return new ERMGetItem($collection);
	}

	public static function createItem($collection, $params) {
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
			$className = ERM::getClassNameByType($field['type']);
			$className::validateInsertData($collection['alias'], $field, $data);
		}

		foreach ($fields as $field) {
			$className = ERM::getClassNameByType($field['type']);

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

		$record = ORM::insert($collection['table'])
		->values($newData)
		->exec('default', true);

		foreach ($fields as $field) {
			$className = ERM::getClassNameByType($field['type']);
			$className::postPrepareInsertData($collection, $field, $record, $data);
		}

		return self::getItem($collection['alias'])
		->where('id', $record['id'])
		->exec();
	}

	public static function update($collection, $params) {
		return new ERMUpdate($collection, $params);
	}

	// Deprecated
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
		$collection = ERM::getCollection($collection);
		$fields = self::sortFields($collection['fields'], $data);

		$currentData = ERM::getItem($collection['alias'])
		->where('id', $id)
		->exec();

		foreach ($fields as $field) {
			if (!isset($data[$field['alias']])) continue;

			$className = ERM::getClassNameByType($field['type']);
			$className::validateUpdateData($collection['alias'], $field, $currentData, $data);
		}

		foreach ($fields as $field) {
			if (!isset($data[$field['alias']])) continue;

			$className = ERM::getClassNameByType($field['type']);

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

		$record = ORM::update($collection['table'])
		->values($newData)
		->where('id', $id)
		->exec();

		foreach ($fields as $field) {
			$className = ERM::getClassNameByType($field['type']);
			$className::postPrepareUpdateData($collection, $field, $newData, $data);
		}

		return $id;
	}

	// Get array of collections
	// It could be news or events or galleries
	public static function getCollections() {
		$res = ORM::select()
		->from('sys_collections')
		->join('sys_collection_fields')
		->on('sys_collection_fields.collection', ORM::field('sys_collections.id'))
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

		$res = ORM::select()
		->from('sys_collections')
		->join('sys_collection_fields')
		->on('sys_collection_fields.collection', ORM::field('sys_collections.id'))
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

	public static function isCollectionExists($alias) {
		if (isset(self::$collections[$alias])) {
			return true;
		}

		$res = ORM::select()
		->from('sys_collections')
		->where('sys_collections.alias', $alias)
		->andWhere('sys_collections.enable', true)
		->exec();

		if (count($res)) {
			return true;
		}

		return false;
	}

	// Get collection by id
	public static function getCollectionById($id) {
		$res = ORM::select()
		->from('sys_collections')
		->join('sys_collection_fields')
		->on('sys_collection_fields.collection', ORM::field('sys_collections.id'))
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
		$types = arrMap(self::getTypes(), function ($type) use (& $types) {
			return $type['type'];
		});

		$index = 1;

		$data = Validate::value([
			'title' => [
				'required' => true,
				'unique' => function ($value) {
					$res = ORM::select()
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
					return !ORM::select()
					->from('sys_collections')
					->where('alias', $value)
					->andWhere('enable', true)
					->length();
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
		$table = ORM::create($data['table']);

		foreach ($tableFields as $field) {
			$table->addField($field);
		}

		$table->addKey('id', 'primary key');
		$table->exec();

		$idCollection = ORM::insert('sys_collections')
		->values([
			'title' => $data['title'],
			'alias' => $data['alias'],
			'table' => $data['table']
		])
		->exec();

		arrMap($data['fields'], function ($field) use ($idCollection) {
			ORM::insert('sys_collection_fields')
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
		$types = arrMap(self::getTypes(), function ($type) {
			return $type['type'];
		});

		foreach ($data['fields'] as $index => $field) {
			$data['fields'][$index]['position'] = $index + 1;
		}

		$data = Validate::value([
			'title' => [
				'required' => true,
				'unique' => function ($value) use ($id) {
					$res = ORM::select()
					->from('sys_collections')
					->where('title', $value)
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

		$sourceFields = arrMap($source['fields'], function ($field) {
			unset($field['collection']);
			$field['settings'] = json_encode($field['settings']);
			$field['position'] = (int)$field['position'];

			return $field;
		});

		$index = 1;

		$dataFields = arrMap(arrSort($data['fields'], function ($a, $b) {
			return $a['position'] < $b['position'];
		}), function ($field) use (& $index) {
			$field['position'] = $index++;

			return $field;
		});

		// get diff
		$arrDiff = self::getFieldsDiff($sourceFields, $dataFields);

		foreach ($arrDiff as $field) {
			switch ($field['mark']) {
				case 'delete':
					ORM::alter($source['table'])
						->dropField($field['element']['alias'])
						->exec();

					break;
			}
		}

		foreach ($arrDiff as $field) {
			switch ($field['mark']) {
				case 'alias':
					$fieldType = array_merge($defaultField, self::getSqlFieldType($field['element']));
					$fieldType['name'] = $field['element']['alias'];
					ORM::alter($source['table'])
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
					ORM::alter($source['table'])
					->addField($fieldType)
					->exec();

					break;
			}
		}

		ORM::update('sys_collections')
		->values([
			'title' => $data['title']
		])
		->id($id)
		->exec();

		foreach ($arrDiff as $field) {
			switch($field['mark']) {
				case 'add':
					ORM::insert('sys_collection_fields')
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
					ORM::delete('sys_collection_fields')
					->id($field['element']['id'])
					->exec();

					break;
				case 'alias':
				case 'edit':
					ORM::update('sys_collection_fields')
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
			}
		}

		$collection = self::getCollectionById($id);
		Response::set('fields', $collection['fields']);
	}

	// Get types for collection structure
	public static function getTypes() {
		if (file_exists(__DIR__ . '/Types')) {
			$dir = opendir(__DIR__ . '/Types');
			$types = [];

			while ($typeFilename = readdir($dir)) {
				$ext = extname($typeFilename);

				if (is_file(__DIR__ . '/Types/' . $typeFilename) && !in_array($typeFilename, ['.', '..']) && $ext === '.php') {
					$typePath = __DIR__ . '/Types/' . $typeFilename;

					if (file_exists($typePath)) {
						require_once $typePath;

						$classNameType = basename($typePath, $ext);

						$classVars = get_class_vars($classNameType);

						$types[] = [
							'name' => $classVars['name'],
							'type' => $classVars['type'],
							'className' => $classNameType,
							'settings' => $classVars['settings']
						];
					}
				}
			}

			return $types;
		}

		return [];
	}

	public static function removeCollection($id) {
		$request = ORM::update('sys_collections')
		->values([
			'enable' => false
		])
		->where('id', $id)
		->exec();
	}

	public static function getField($collection, $fieldAlias) {
		$collection = self::getCollection($collection);

		foreach ($collection['fields'] as $field) {
			if ($field['alias'] === $fieldAlias) {
				return $field;
			}
		}

		return null;
	}

	private static function getFieldsDiff($src, $dest) {
		$srcIndexed = [];
		$destIndexed = [];
		$result = [];

		foreach ($src as $field) {
			$srcIndexed[$field['id']] = $field;
		}

		foreach ($dest as $field) {
			$destIndexed[$field['id']] = $field;
		}

		foreach ($srcIndexed as $id => $field) {
			if (!isset($destIndexed[$id])) {
				$result[] = [
					'mark' => 'delete',
					'element' => $field
				];
			} elseif (
				$field['alias'] !== $destIndexed[$id]['alias'] ||
				$field['type'] !== $destIndexed[$id]['type']
			) {
				$result[] = [
					'mark' => 'alias',
					'origin' => $field,
					'element' => $destIndexed[$id]
				];
			} elseif (
				$field['title'] !== $destIndexed[$id]['title'] ||
				$field['required'] !== $destIndexed[$id]['required'] ||
				$field['settings'] !== $destIndexed[$id]['settings'] ||
				$field['position'] !== $destIndexed[$id]['position']
			) {
				$result[] = [
					'mark' => 'edit',
					'origin' => $field,
					'element' => $destIndexed[$id]
				];
			}
		}

		foreach ($dest as $field) {
			if (!isset($srcIndexed[$field['id']])) {
				$result[] = [
					'mark' => 'add',
					'element' => $field
				];
			}
		}

		return $result;
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
		$tableList = ORMDatabase::getTables();
		$tableName = $alias;
		$i = 1;

		while (in_array($tableName, $tableList)) {
			$tableName = $alias . ($i++);
		}

		return $tableName;
	}

	private static function createTables() {
		if (!ORM::exists('sys_collections')) {
			ORM::create('sys_collections')
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

		if (!ORM::exists('sys_collection_fields')) {
			ORM::create('sys_collection_fields')
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
}
