<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/helper.php';

$path = urldecode($_GET['path']);

checkLocalPath($path);
