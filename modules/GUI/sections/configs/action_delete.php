<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$deleteSections = SFValidate::parse([
  [
    'name' => 'deleteSections',
    'minlength' => 1,
    'array' => [
      'require' => true,
      'type' => 'uzint',
      'skip_row_if_empty' => true,
      'validate' => function ($value) {
        return true;
      }
    ]
  ]
], $_POST);

foreach ($deleteSections['deleteSections'] as $id) {
  SFGUI::removeSection($id);
}
