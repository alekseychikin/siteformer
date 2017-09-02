<?php

ini_set('display_errors', 'off');
error_reporting(E_ALL);

ob_start();

define('ROOT', realpath(__DIR__ . '/../') . '/');
define('ENGINE', __DIR__ . '/');
define('ENGINE_TEMP', ENGINE . 'temp/');

require_once __DIR__ . '/classes/response.php';
require_once __DIR__ . '/classes/base-exception.php';
require_once __DIR__ . '/classes/error_handler.php';
register_shutdown_function('fatalErrorHandler');
set_error_handler('errorHandler');
set_exception_handler('exceptionHandler');

include __DIR__ . "/engine.php";
