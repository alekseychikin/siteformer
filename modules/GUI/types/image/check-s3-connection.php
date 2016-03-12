<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$accessKey = $_GET['accessKey'];
$secretKey = $_GET['secretKey'];
S3::setExceptions(true);
$s3 = new S3($accessKey, $secretKey);
SFResponse::set('buckets', false);
SFResponse::set('auth', true);
try {
  $listBuckets = $s3->listBuckets();
  SFResponse::set('buckets', $listBuckets);
}
catch (Exception $e) {
  SFResponse::set('auth', false);
}
