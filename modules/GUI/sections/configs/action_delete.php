<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $deleteSections = SFValidate::parse(array(
    array(
      'name' => 'deleteSections',
      'minlength' => 1,
      'array' => array(
        'require' => true,
        'type' => 'uzint',
        'skip_row_if_empty' => true,
        'validate' => function ($value)
        {
          return true;
        }
      )
    )
  ), $_POST);
  $deleteSections = $deleteSections['deleteSections'];

  $ids = array();
  foreach ($deleteSections as $id) {
    $ids[] = _expr_('id', $id);
  }

  SFORM::update('sections')
    ->values(array(
      'enable' => 0
    ))
    ->where(_or_($ids))
    ->exec();
  echo SFORM::lastQuery();

?>
