<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$src = urldecode($_GET['src']);
$section = $_GET['section'];
$field = $_GET['field'];

$result = SFORM::select()
  ->from('type_tags')
  ->where('section', $section)
  ->andWhere('field', $field)
  ->andWhere('tag', 'LIKE', $src . '%')
  ->exec();

SFResponse::set('result', arrMap($result, function ($tag) {
  return [
    'id' => $tag['id'],
    'title' => $tag['tag']
  ];
}));
