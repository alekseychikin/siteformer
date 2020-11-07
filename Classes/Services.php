<?php

namespace Engine\Classes;

class Services {
	private static $paths = [];

	public static function registerPath($path) {
		self::$paths[] = $path;
	}

	public static function get($model, $params) {
		return self::run($model, 'get', $params);
	}

	public static function post($model, $params) {
		return self::run($model, 'post', $params);
	}

	public static function files($model, $params) {
		return self::run($model, 'files', $params);
	}

	public static function action($model, $action, $params) {
		return self::run($model, $action, $params);
	}

	private static function run($model, $method, $params) {
		if ($serviceClass = self::getClass($model)) {
			if (self::isAssoc($params)) {
				return call_user_func([$serviceClass, $method], $params);
			}

			return call_user_func_array([$serviceClass, $method], $params);
		}

		return false;
	}

	private static function isAssoc($arr) {
		if (array() === $arr) return false;
		return array_keys($arr) !== range(0, count($arr) - 1);
	}

	private static function getClass($model) {
		foreach (self::$paths as $pathItem) {
			$serviceClass = $pathItem . Text::camelCasefy($model, true);

			if (class_exists($serviceClass)) {
				return $serviceClass;
			}
		}

		return false;
	}
}
