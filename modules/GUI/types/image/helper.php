<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../../../classes/response.php';
require_once __DIR__ . '/../../../../classes/validate-exception.php';
require_once __DIR__ . '/../../../../classes/S3.php';

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

function checkAuthS3 ($accessKey, $secretKey) {
  S3::setExceptions(true);
  S3::$useSSL = true;

  $s3 = new S3($accessKey, $secretKey);

  try {
    $listBuckets = $s3->listBuckets();
    SFResponse::set('buckets', $listBuckets);
  } catch (Exception $e) {
    throw new ValidateException(['code' => 'EPATHDOESNTEXISTS', 'index' => ['s3SecretKey'], 'source' => $secretKey]);
  }
}
