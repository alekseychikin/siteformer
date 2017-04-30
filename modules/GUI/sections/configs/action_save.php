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

  $data = SFValidate::value([
    'title' => [
      'required' => true,
      'unique' => function ($value) use ($id) {
        $res = SFORM::select()
          ->from('sections')
          ->where('title', $value)
          ->andWhere('enable', 1);

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
          ->from('sections')
          ->where('alias', $value)
          ->andWhere('enable', 1);

        if ($id !== false) {
          $res = $res->andWhere('id', '!=', $id);
        }

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
  ], $_POST);

  SFGUI::saveSection($id, $data);
  SFResponse::set('section', SFGUI::getSectionById($id));
}
