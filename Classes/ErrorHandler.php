<?php

namespace Engine\Classes;

class errorHandler {
	private static $handlers = [];

	public static function setHandler($handler) {
		self::$handlers[] = $handler;
	}

	public static function shutdownHandler() {
		$error = error_get_last();

		switch ($error['type']) {
			case E_ERROR:
			case E_CORE_ERROR:
			case E_COMPILE_ERROR:
			case E_USER_ERROR:
			case E_RECOVERABLE_ERROR:
			case E_CORE_WARNING:
			case E_COMPILE_WARNING:
			case E_PARSE:
				throw new \ErrorException($error['message'], 0, $error['type'], $error['file'], $error['line']);
		}
	}

	public static function exceptionHandler($exception) {
		foreach (self::$handlers as $handler) {
			$handler($exception);
		}

		if (APPLICATION_ENV === 'develop/') {
			\Engine\Classes\Response::error(
				500,
				$exception->getMessage() . ' at ' . $exception->getFile() .
				':' . $exception->getLine(),
				$exception->getTrace()
			);
		} else {
			\Engine\Modules\Router\Router::handleError(500);
		}
	}

	public static function errorHandler($errno, $msg, $file, $line) {
		if (error_reporting() || $errno) {
			throw new \ErrorException($msg, 0, $errno, $file, $line);
		}
	}
}
