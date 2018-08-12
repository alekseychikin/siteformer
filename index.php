<?php

ini_set('display_errors', false);
error_reporting(E_ALL);

if (getenv('APPLICATION_ENV') !== false) {
  define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
} else {
  define('APPLICATION_ENV', 'production');
}

require_once __DIR__ . '/classes/log.php';

ob_start();

define('ROOT', realpath(__DIR__ . '/../') . '/');
define('ENGINE', __DIR__ . '/');
define('ENGINE_TEMP', ENGINE . 'temp/');

require_once __DIR__ . '/classes/helpers.php';
require_once __DIR__ . '/classes/response.php';
require_once __DIR__ . '/classes/base-exception.php';
require_once __DIR__ . '/classes/error-handler.php';

register_shutdown_function('shutdownHandler');
set_exception_handler('exceptionHandler');
set_error_handler('errorHandler', E_ALL | E_STRICT);

include __DIR__ . "/engine.php";
