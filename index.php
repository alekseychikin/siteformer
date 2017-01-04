<?php

ini_set('display_errors', 'off');
error_reporting(E_ALL);

ob_start();

$e = new Exception();
$trace = $e->getTrace();

define('ROOT', realpath(dirname($trace[0]['file'])) . '/');
define('ENGINE', realpath(dirname(__FILE__)) . '/');
define('ENGINE_TEMP', ENGINE . 'temp/');

require_once __DIR__ . '/classes/response.php';
require_once __DIR__ . '/classes/base_exception.php';
require_once __DIR__ . '/classes/error_handler.php';
register_shutdown_function('fatalErrorHandler');
set_error_handler('errorHandler');
set_exception_handler('exceptionHandler');

include __DIR__ . "/engine.php";
