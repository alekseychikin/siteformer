<?php

namespace Engine;

ini_set('display_errors', true);
error_reporting(E_ALL);

if (getenv('APPLICATION_ENV') !== false) {
	define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
} else {
	define('APPLICATION_ENV', 'production');
}

ob_start();

define('ROOT', realpath(__DIR__ . '/../') . '/');
define('ENGINE_TEMP', __DIR__ . '/temp/');

$shutdownHandler = include __DIR__ . '/errorHandlers/shutdownHandler.php';
$exceptionHandler = include __DIR__ . '/errorHandlers/exceptionHandler.php';
$errorHandler = include __DIR__ . '/errorHandlers/errorHandler.php';

register_shutdown_function($shutdownHandler);
set_exception_handler($exceptionHandler);
set_error_handler($errorHandler, E_ALL | E_STRICT);

return include __DIR__ . '/engine.php';
