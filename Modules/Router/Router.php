<?php

namespace Engine\Modules\Router;

use \Engine\Classes\Models;
use \Engine\Classes\Response;
use \Engine\Modules\Templater\Templater;

class Router {
	public static $languages = [];
	private static $uri;
	private static $routes = [];
	private static $language = '';

	public static function setRoutes($url, $routes) {
		self::$routes = $routes;

		$uri = [];
		$uriRaw = rawurldecode($url);

		if (strpos($uriRaw, '?') !== false) {
			$uriRaw = substr($uriRaw, 0, strpos($uriRaw, '?'));
		}

		$uriRaw = explode('/', $uriRaw);
		$max = 10;
		$i = 1;

		foreach ($uriRaw as $key => $val) {
			if ($i++ <= $max && !empty($val)) {
				$uri[] = $uriRaw[$key];
			}
		}

		self::$uri = $uri;

		Response::set('uri', self::$uri, true);

		if (is_callable($routes)) {
			self::$routes = $routes(self::getUri());
		}

		if (strpos($_SERVER['REQUEST_URI'], '?') !== false) {
			$get = substr($_SERVER['REQUEST_URI'], strpos($_SERVER['REQUEST_URI'], '?') + 1);
			$get = explode('&', $get);

			foreach ($get as $val) {
				$key = explode('=', $val);

				if (isset($key[1])) {
					$_GET[$key[0]] = $key[1];
				} else {
					$_GET[$key[0]] = '';
				}
			}
		}
	}

	public static function setLanguages($languages) {
		self::$languages = $languages;

		Response::set('lang', '', true);
		Response::set('uri', self::getUri());
		Response::set('uri_items', $uri);

		// lang handler
		if (isset(self::$uri[0]) && in_array(self::$uri[0], self::$languages)) {
			self::$language = self::$uri[0];
			self::$uri = array_splice(self::$uri, 1);
			Response::set('lang', self::$language, true);
		} else if (count(self::$languages)) {
			self::$language = self::$languages[0];
		}
	}

	public static function route() {
		$url = self::getUri();

		if ($url === '/' && isset($_GET['graph'])) {
			// TODO: Нужно придумать модель передачи данных
			// в зависимости от content-type
			// x-www-form-urlencode
			// application/json
			// Нужно обернуть стркутуру запросов в SFModelGet и Modelset
			// и далее получить данные
			self::returnModelData(parseJSON(urldecode($_GET['graph'])));

			return true;
		}

		$route = self::parse($url);

		self::handleRoute($route);

		return true;
	}

	public static function addRule($url, $action) {
		self::$routes[$url] = $action;
	}

	public static function language() {
		return self::$language;
	}

	public static function defaultLanguage() {
		return self::$languages[0];
	}

	public static function uri($item) {
		if (isset(self::$uri[$item])) {
			return self::$uri[$item];
		}

		return '';
	}

	public static function uriNum() {
		return count(self::$uri);
	}

	public static function getUriByArray($num = 0) {
		if ($num != 0) {
			$uri = [];

			for ($i = 0; $i <= $num; $i++) {
				$uri[$i] = self::$uri[$i];
			}

			return $uri;
		}

		return self::$uri;
	}

	private static function parse($url) {
		if (substr($url, -1, 1) == '/') $url = substr($url, 0, -1);

		$uri = self::getUri();

		if (isset(self::$routes[$uri])) {
			return [
				'pattern' => $uri,
				'path' => self::$routes[$uri], 'params' => []
			];
		} else {
			// find out all pairs of stars-keys => path-to-controller
			// relations contains connection of starts-key to origin key with variables
			list($pairs, $relations) = self::parseUriReplace(self::$routes);

			// getting array of uri
			$uri = self::getUriByArray(self::uriNum() - 1);

			// get a string with stars
			$compuri = self::recParsive($pairs, $uri);

			// find out the path to controller by starts-key
			if (isset($pairs[$compuri])) {

				// get original key with variables by starts-key
				$pattern = $relations[$compuri];
				$uri = explode('/', $pattern);
				$params = [];

				foreach ($uri as $key => $val) {
					if (strpos($val, '{') === 0 && strrpos($val, '}') === strlen($val) -1) {

						// make a variables
						$field = substr($val, 1, strlen($val) -2);
						$param = self::uri($key -1);
						$params[$field] = $param;
					}
				}

				return ['pattern' => $pattern, 'path' => $pairs[$compuri], 'params' => $params];
			}
		}

		throw new \Engine\Classes\Exceptions\PageNotFoundException('');
	}

	private static function recParsive($params, & $uri) {
		foreach ($params as $pattern => $actionPath) {
			$pattern = explode('/', $pattern);
			$pattern = arrFilter($pattern, function ($value) {
				return strlen($value);
			});

			if(count($pattern) && count($pattern) === count($uri)) {
				$t = true;

				for ($i = 0; $i < count($pattern); $i++) {
					if ($pattern[$i] !== '*' && $pattern[$i] !== $uri[$i]) {
						$t = false;
					}
				}

				if ($t) {
					return '/' . implode('/', $pattern) . '/';
				}
			}
		}

		return false;
	}

	private static function returnModelData($params) {
		if (!$params) {
			$params = [];
		}

		if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST') {
			$post = $_POST;
			$files = self::prepareFiles();

			foreach ($files as $key => $value) {
				if (isset($post[$key])) {
					$post[$key] = array_merge($post[$key], $value);
				} else {
					$post[$key] = $value;
				}
			}

			foreach ($post as $key => $value) {
				Response::set($key, Models::post($key, $value));
			}
		}

		$params = self::prepareGetParams($params);

		foreach ($params as $key => $value) {
			Response::set($key, $value);
		}

		Response::render();
	}

	private static function prepareFiles() {
		$files = [];

		foreach ($_FILES as $field => $item) {
			$files[$field] = [];

			foreach ($item as $paramName => $param) {
				self::getFilesFields($param, $paramName, $files[$field]);
			}
		}

		return $files;
	}

	private static function getFilesFields($value, $paramName, & $result) {
		if (gettype($value) !== 'array') {
			$result[$paramName] = $value;
		} else {
			$isNumberIndexes = true;

			foreach ($value as $index => $item) {
				if (gettype($index) !== 'integer') {
					$isNumberIndexes = false;
				}
			}

			if ($isNumberIndexes) {
				$result[$paramName] = $value;
			} else {
				foreach ($value as $field => $item) {
					if (!isset($result[$field])) {
						$result[$field] = [];
					}

					self::getFilesFields($item, $paramName, $result[$field]);
				}
			}
		}
	}

	private static function handleRoute($route) {
		if (is_callable($route['path'])) {
			$route['path'] = call_user_func_array($route['path'], $route['params']);
		}

		if ($route['path'] instanceof \Engine\Modules\Router\RouterRoute) {
			$data = $route['path']->getData();
			$template = $route['path']->getTemplate();

			$params = self::prepareGetParams($data, $params);

			foreach ($params as $key => $value) {
				Response::set($key, $value);
			}

			$headers = Response::getRequestHeaders();

			if (isset($headers['Accept'])) {
				$accept = strtolower($headers['Accept']);
			}

			if (self::isHeaderContainsAnyItem($accept, ['text/html', '*/*'])) {
				echo Templater::render($template, Response::getState());
			}
		}
	}

	private static function isHeaderContainsAnyItem($header, $values) {
		foreach ($values as $value) {
			if (strpos($header, $value) !== false) {
				return true;
			}
		}

		return false;
	}

	private static function prepareGetParams($rules = [], $inputData = []) {
		$outputData = [];

		foreach ($rules as $key => $value) {
			if (gettype($value) === 'array' && isset($value['model'])) {
				$params = [];

				if (isset($value['params'])) {
					$params = $value['params'];
				}

				$inputData[$key] = self::getDataFromModel($value['model'], $params);
				$outputData[$key] = $inputData[$key];
			} elseif (gettype($value) === 'array') {
				$subData = self::prepareGetParams($value, $inputData);
				$outputData[$key] = $subData;
			} else {
				$outputData[$key] = $value;
			}
		}

		return $outputData;
	}

	private static function getDataFromModel($model, $params) {
		return Models::get($model, $params);
	}

	private static function parseSource($source, $params) {
		$model = '';
		$data = [];

		if (strpos($source, '?') !== false) {
			$model = substr($source, 0, strpos($source, '?'));
			$data = substr($source, strpos($source, '?') + 1);
			$data = explode('&', $data);

			foreach ($data as $index => $item) {
				$item = explode('=', $item);
				unset($data[$index]);
				$data[$item[0]] = '';

				if (isset($item[1])) {
					$value = $item[1];

					foreach ($params as $field => $val) {
						if (gettype($val) !== 'array' && gettype($val) !== 'object') {
							$value = str_replace('{' . $field . '}', $val, $value);
						}
					}

					$data[$item[0]] = $value;
				}
			}
		} else {
			$model = $source;
		}

		return [$model, $data];
	}

	private static function parseUriReplace($uri) {
		$replaceUri = [];
		$relations = [];

		foreach ($uri as $key => $val) {
			$preparedKey = $key;

			// TOOD: переписать на регулярку
			while (strpos($preparedKey, '{') !== false && strpos($preparedKey, '}') !== false && strpos($preparedKey, '{') < strpos($preparedKey, '}')) {
				$preparedKey = substr($preparedKey, 0, strpos($preparedKey, '{')) . '*' . substr($preparedKey, strpos($preparedKey, '}') + 1);
			}

			$replaceUri[$preparedKey] = $val;
			$relations[$preparedKey] = $key;
		}

		return [$replaceUri, $relations];
	}

	private static function getUri() {
		return '/' . (count(self::$uri) ? implode('/', self::$uri) . '/' : '');
	}
}
