<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $accessKey = $_GET['accessKey'];
  $secretKey = $_GET['secretKey'];
  $bucket = $_GET['bucket'];
  $path = SFPath::prepareDir($_GET['path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);
  S3::setExceptions(true);
  $s3 = new S3($accessKey, $secretKey);
  $obj = S3::getObjectInfo($bucket, $path, true);
  SFResponse::set('exists', $obj !== false);
  SFResponse::render();

?>
