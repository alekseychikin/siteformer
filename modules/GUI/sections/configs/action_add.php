<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$modules = SFGUI::getModules();
$modules[] = 'default';
$types = [];

arrMap(SFGUI::getTypes(), function ($type) use (& $types) {
  $types[] = $type['type'];
});

SFResponse::showContent();
SFORM::showError();

$data = SFValidate::value([
  'title' => [
    'required' => true,
    'unique' => function ($value) {
      $res = SFORM::select()
        ->from('sections')
        ->where('title', $value)
        ->andWhere('enable', 'IS NOT', NULL);

      return !$res->length();
    }
  ],
  'alias' => [
    'required' => true,
    'valid' => '/^[a-zA-Z\-_]+$/i',
    'unique' => function ($value) {
      $res = SFORM::select()
        ->from('sections')
        ->where('alias', $value)
        ->andWhere('enable', 'IS NOT', NULL);

      return !$res->length();
    }
  ],
  'module' => [
    'required' => true,
    'values' => $modules
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
      'required' => [],
      'settings' => [
        'type' => 'array',
        'modify' => function ($settings) {
          return json_encode($settings);
        }
      ],
      'position' => [
        'valid' => '/^\d+$/'
      ]
    ]
  ]
], $_POST);

$id = SFGUI::addSection($data);
SFResponse::set('section', SFGUI::getSectionById($id));
