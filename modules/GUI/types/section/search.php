<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$src = urldecode($_GET['src']);
$section = $_GET['section'];
$field = $_GET['field'];

$result = SFGUI::getItemList($section)
  ->where($field, $src, ['find' => 'prefix'])
  ->limit(10)
  ->exec();

SFResponse::set('result', ArrMap($result, function ($item) use ($field) {
  return ['id' => $item['id'], 'title' => $item[$field]];
}));
