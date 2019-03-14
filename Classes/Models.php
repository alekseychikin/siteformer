<?php

namespace Engine\Classes;

class Models {
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
		if ($className = self::getClass($model)) {
			return call_user_func([$className, 'post'], $params);
		}

		return false;
	}

	public static function files($model, $params) {
		if ($className = self::getClass($model)) {
			return call_user_func([$className, 'files'], $params);
		}

		return false;
	}

	private static function getClass($model) {
		foreach (self::$paths as $pathItem) {
			$modelPath = $pathItem . $model;

			if (class_exists($modelPath)) {
				return $modelPath;
			}
		}

		return false;
	}
}
