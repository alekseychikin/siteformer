<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$src = urldecode($_GET['src']);
$collection = $_GET['collection'];
$field = $_GET['field'];

$result = SFORM::select()
  ->from('sys_type_tags')
  ->where('collection', $collection)
  ->andWhere('field', $field)
  ->andWhere('tag', 'LIKE', $src . '%')
  ->exec();

SFResponse::set('result', arrMap($result, function ($tag) {
  return [
    'id' => $tag['id'],
    'title' => $tag['tag']
  ];
}));
