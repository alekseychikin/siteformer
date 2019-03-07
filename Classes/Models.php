<?php

namespace Engine\Classes;

require_once __DIR__ . '/text.php';

class Models {
	private static $paths = [];

	public static function registerPath($path) {
		self::$paths[] = pathresolve($path);
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
		$path = explode('/', $model);
		$finded = false;

		foreach (self::$paths as $pathItem) {
			$modelPath = pathresolve($pathItem, $model . '.php');

			if (file_exists($modelPath)) {
				require_once $modelPath;

				$model = $path[count($path) - 1];
				return Text::camelCasefy($model, true);
			}
		}

		return false;
	}
}
