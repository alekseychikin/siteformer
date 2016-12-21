<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$id = $_POST['id'];
$section = SFGUI::getSection($_POST['section']);

SFORM::update($section['table'])
  ->values([
    'status' => 'deleted'
  ])
  ->where('id', $id)
  ->exec();
