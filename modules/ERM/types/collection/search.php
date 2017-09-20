<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$src = urldecode($_GET['src']);
$collection = $_GET['collection'];
$field = $_GET['field'];

$result = SFERM::getItemList($collection)
  ->where($field, $src, ['find' => 'prefix'])
  ->limit(10)
  ->exec();

SFResponse::set('result', ArrMap($result, function ($item) use ($field) {
  return ['id' => $item['id'], 'title' => $item[$field]];
}));
