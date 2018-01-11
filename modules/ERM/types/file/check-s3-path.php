<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$accessKey = $_GET['accessKey'];
$secretKey = urldecode($_GET['secretKey']);
$bucket = $_GET['bucket'];
$path = urldecode($_GET['path']);
$path = SFPath::prepareDir($path, PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

S3::setExceptions(true);
S3::$useSSL = true;
$s3 = new S3($accessKey, $secretKey);
try {
  var_dump($path);
  $obj = S3::getObjectInfo($bucket, $path, true);
  var_dump($obj);
  SFResponse::set('exists', $obj !== false);
} catch (Exception $e) {
}
