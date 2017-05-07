<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../../../classes/validate-exception.php';

function checkLocalPath ($path) {
  $path = SFPath::prepareDir($path, PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

  if ($path === '/') {
    $path = "";
  }

  $path = ROOT . $path;

  SFResponse::set('path', $path);

  $exists = file_exists($path) && is_dir($path);

  if (!$exists) {
    throw new ValidateException(['code' => 'EPATHDOESNTEXISTS', 'index' => ['path'], 'source' => $path]);
  }

  if (!is_writable($path)) {
    throw new ValidateException(['code' => 'ENOWRITERIGHTS', 'index' => ['path'], 'source' => $path]);
  }
}
