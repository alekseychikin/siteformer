<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$modules = SFGUI::getModules();
$modules[] = 'default';
$types = [];

arrMap(SFGUI::getTypes(), function ($type) use (& $types) {
  $types[] = $type['type'];
});

SFResponse::showContent();
SFORM::showError();
$data = SFValidate::parse([
  [
    'name' => 'title',
    'require' => true,
    'error' => 'Поле «Название» обязательно для заполнения, должно быть уникальным',
    'unique' => function ($value) {
      $res = SFORM::select()
        ->from('sections')
        ->where('title', $value)
        ->andWhere('enable', 'IS NOT', NULL);

      return !$res->length();
    }
  ],
  [
    'name' => 'alias',
    'require' => true,
    'valid' => '/^[a-zA-Z0-9\-_]+$/i',
    'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса',
    'unique' => function ($value) {
      $res = SFORM::select()
        ->from('sections')
        ->where('alias', $value)
        ->andWhere('enable', 'IS NOT', NULL);

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
        'name' => 'required'
      ],
      [
        'name' => 'settings',
        'modify' => function ($settings) {
          return json_encode($settings);
        }
      ],
      [
        'name' => 'position',
        'valid' => '/^\d+$/'
      ]
    ]
  ]
], $_POST);

$id = SFGUI::addSection($data);
SFResponse::set('section', SFGUI::getSectionById($id));
