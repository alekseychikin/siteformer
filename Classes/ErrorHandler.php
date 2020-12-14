<?php

namespace Engine\Classes;

use Engine\Classes\Migrations;
use Engine\Classes\Response;
use Engine\Modules\Router\Router;

class ErrorHandler {
	private static $handlers = [];

	public static function setHandler($handler) {
		self::$handlers[] = $handler;
	}

	public static function shutdownHandler() {
		$error = error_get_last();

		if (isset($error['type'])) {
			switch ($error['type']) {
				case E_ERROR:
				case E_CORE_ERROR:
				case E_COMPILE_ERROR:
				case E_USER_ERROR:
				case E_RECOVERABLE_ERROR:
				case E_CORE_WARNING:
				case E_COMPILE_WARNING:
				case E_PARSE:
					self::printError($error['message'], $error['file'], $error['line']);
			}
		}
	}

	public static function exceptionHandler($exception) {
		foreach (self::$handlers as $handler) {
			$handler($exception);
		}

		self::printError(
			$exception->getMessage(),
			$exception->getFile(),
			$exception->getLine(),
			print_r($exception->getTrace(), true)
		);
	}

	public static function errorHandler($errno, $msg, $file, $line, $trace = null) {
		if (error_reporting() || $errno) {
			self::printError($msg, $file, $line, print_r($trace === null ? debug_backtrace() : $trace, true));
		}
	}

	private static function printError($msg, $file, $line, $additional = '') {
		if (APPLICATION_ENV === 'develop') {
			Migrations::removeLock();
			Response::error(
				500,
				$msg . ' at ' . $file . ':' . $line . (strlen($additional) ? '<pre>' . $additional . '</pre>' : '')
			);
		} else {
			Router::handleError(500);
		}
	}
}
