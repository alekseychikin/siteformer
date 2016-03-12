<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$path = $_POST['path'];

$path = ROOT . SFPath::prepareDir($path, PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);
SFResponse::set('path', $path);
$exists = file_exists($path) && is_dir($path);
SFResponse::set('writePermission', true);
SFResponse::set('exists', $exists);

if ($exists) {
  try {
    $file = fopen($path . 'tmp.log', 'w');
    fclose($file);
    unlink($path . 'tmp.log');
    SFResponse::set('writePermission', true);
  }
  catch (Exception $e) {
    SFResponse::set('writePermission', false);
  }
}
