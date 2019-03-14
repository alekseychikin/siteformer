<?php

namespace Engine;

use \Engine\Classes\ErrorHandler;

if (getenv('APPLICATION_ENV') !== false) {
	define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
} else {
	define('APPLICATION_ENV', 'production');
}

ob_start();

define('ROOT', realpath(__DIR__ . '/../') . '/');
define('ENGINE_TEMP', __DIR__ . '/temp/');

register_shutdown_function('\Engine\Classes\ErrorHandler::shutdownHandler');
set_exception_handler('\Engine\Classes\ErrorHandler::exceptionHandler');
set_error_handler('\Engine\Classes\ErrorHandler::errorHandler', E_ALL | E_STRICT);

return include __DIR__ . '/engine.php';
