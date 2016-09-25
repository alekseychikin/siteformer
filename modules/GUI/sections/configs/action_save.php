<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$id = false;
if (isset($_POST['id'])) {
  $id = (int)$_POST['id'];
}

if ($id === false) {
  include __DIR__.'/action_add.php';
} else {
  $modules = SFGUI::getModules();
  $modules[] = 'default';
  $types = [];

  arrMap(SFGUI::getTypes(), function ($type) use (& $types) {
    $types[] = $type['type'];
  });

  SFResponse::set('id', $id);

  $data = SFValidate::parse([
    [
      'name' => 'title',
      'require' => true,
      'error' => 'Поле «Название» обязательно для заполнения, должно быть уникальным',
      'unique' => function ($value) use ($id) {
        $res = SFORM::select()
          ->from('sections');

        if ($id !== false) {
          $res = $res
            ->where('title', $value)
            ->andWhere('id', '!=', $id);
        } else {
          $res = $res->where('title', $value);
        }

        return !$res->length();
      }
    ],
    [
      'name' => 'alias',
      'require' => true,
      'valid' => '/^[a-zA-Z0-9\-_]+$/i',
      'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса',
      'unique' => function ($value) use ($id) {
        $res = SFORM::select()
          ->from('sections');

        if ($id !== false) {
          $res = $res->where('alias', $value)
            ->andWhere('id', '!=', $id);
        } else {
          $res = $res->where('alias', $value);
        }

        return !$res->length();
      }
    ],
    [
      'name' => 'module',
      'require' => true,
      'values' => $modules,
      'error' => 'Задан странный Модуль :value'
    ],
    [
      'name' => 'fields',
      'minlength' => 1,
      'error' => 'Не заданы поля',
      'array' => [
        [
          'name' => 'id',
          'require' => false,
          'valid' => '/^\d+$/',
          'error' => 'Уникальный айди'
        ],
        [
          'name' => 'title',
          'require' => true,
          'unique' => true,
          'error' => 'Уникальное имя, обязательное для заполнения',
          'skip_row_if_empty' => true
        ],
        [
          'name' => 'alias',
          'require' => true,
          'unique' => true,
          'valid' => '/^[a-zA-Z0-9\-_]+$/i',
          'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса'
        ],
        [
          'name' => 'type',
          'values' => $types,
          'error' => 'Зада странный тип поля :value'
        ],
        [
          'name' => 'settings',
          'modify' => function ($settings) {
            return json_encode($settings);
          }
        ],
        [
          'name' => 'position',
          'valid' => '/^\d+$/',
          'unique' => true
        ]
      ]
    ]
  ], $_POST);

  SFGUI::saveSection($id, $data);
  SFResponse::set('section', SFGUI::getSectionById($id));
}
