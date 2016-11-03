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

$ids = array();

foreach ($deleteSections as $id) {
  $ids[] = _expr_('id', $id);
}

SFORM::update('sections')
  ->values(array(
    'enable' => NULL
  ))
  ->where(_or_($ids))
  ->exec();
