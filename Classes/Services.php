<?php

namespace Engine\Classes;

class Services {
	private static $paths = [];

	public static function registerPath($path) {
		self::$paths[] = $path;
	}

	public static function get($model, $params) {
		if ($serviceClass = self::getClass($model)) {
			return call_user_func([$serviceClass, 'get'], $params);
		}

		return false;
	}

	public static function post($model, $params) {
		if ($serviceClass = self::getClass($model)) {
			return call_user_func([$serviceClass, 'post'], $params);
		}

		return false;
	}

	public static function files($model, $params) {
		if ($serviceClass = self::getClass($model)) {
			return call_user_func([$serviceClass, 'files'], $params);
		}

		return false;
	}

	public static function action($model, $action, $params) {
		if ($serviceClass = self::getClass($model)) {
			return call_user_func([$serviceClass, $action], $params);
		}

		return false;
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
