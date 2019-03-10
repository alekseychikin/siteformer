<?php

namespace Engine\Classes;

use \Engine\Classes\Text;

class Models {
	private static $paths = [];

	public static function registerPath($path) {
		self::$paths[] = $path;
	}

	public static function get($model, $params) {
		if ($className = self::getClassNameByModelName($model)) {
			return call_user_func([$className, 'get'], $params);
		}

		return false;
	}

	public static function post($model, $params) {
		if ($className = self::getClassNameByModelName($model)) {
			return call_user_func([$className, 'post'], $params);
		}

		return false;
	}

	public static function files($model, $params) {
		if ($className = self::getClassNameByModelName($model)) {
			return call_user_func([$className, 'files'], $params);
		}

		return false;
	}

	private static function getClassNameByModelName($model) {
		foreach (self::$paths as $pathItem) {
			$modelPath = $pathItem . $model;

			if (class_exists($modelPath)) {
				return $modelPath;
			}
		}

		return false;
	}
}
