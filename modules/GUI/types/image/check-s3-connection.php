<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/helper.php';

$accessKey = $_GET['accessKey'];
$secretKey = urldecode($_GET['secretKey']);

checkAuthS3($accessKey, $secretKey);
