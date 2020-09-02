<?php

namespace Engine\Modules\Router;

use Engine\Classes\Services;
use Engine\Classes\ServiceGet;
use Engine\Classes\ServicePost;
use Engine\Classes\ServiceAction;
use Engine\Classes\Response;
use Engine\Modules\Templater\Templater;

class Router {
	public static $languages = [];
	private static $uri = [];
	private static $routes = [];
	private static $errorPages = [];
	private static $language = '';

	public static function addRoutes($routes) {
		self::$routes[] = $routes;
	}

	public static function setUrl($url) {
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
	}

	public static function setErrorPages($pages) {
		self::$errorPages = $pages;
	}

	public static function setLanguages($languages) {
		self::$languages = $languages;

		Response::set('lang', '', true);
		Response::set('uri', self::getUri());
		Response::set('uri_items', self::$uri);

		if (isset(self::$uri[0]) && in_array(self::$uri[0], self::$languages)) {
			self::$language = self::$uri[0];
			self::$uri = array_splice(self::$uri, 1);
			Response::set('lang', self::$language, true);
		} else if (count(self::$languages)) {
			self::$language = self::$languages[0];
		}
	}

	public static function route() {
		$routes = [];

		foreach(self::$routes as $route) {
			if (is_callable($route)) {
				$routes = array_merge($routes, $route(self::getUri()));
			} else {
				$routes = array_merge($routes, $route);
			}
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

		$url = self::getUri();

		if ($url === '/' && isset($_GET['api'])) {
			self::handleApiRequest();

			return true;
		}

		$route = self::parse($url, $routes);

		self::handleRoute($route);

		return true;
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

	public static function handleError($error) {
		foreach (self::$errorPages as $code => $route) {
			$regexp = '/^' . str_replace('x', '.', $code) . '$/';

			if (preg_match($regexp, $error)) {
				$message = Templater::render($route->getTemplate(), []);

				Response::error($error, $message);
			}
		}

		Response::error($error);
	}

	private static function parse($url, $routes) {
		if (substr($url, -1, 1) == '/') $url = substr($url, 0, -1);

		$uri = self::getUri();

		if (isset($routes[$uri])) {
			return self::extractRoute([
				'path' => $routes[$uri],
				'params' => []
			]);
		} else {
			// find out all pairs of stars-keys => path-to-controller
			// relations contains connection of starts-key to origin key with variables
			list($pairs, $relations) = self::parseUriReplace($routes);

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

				return self::extractRoute([
					'path' => $pairs[$compuri],
					'params' => $params
				]);
			}
		}

		throw new \Engine\Classes\Exceptions\PageNotFoundException('');
	}

	private static function extractRoute($result) {
		if (is_callable($result['path'])) {
			return call_user_func_array($result['path'], $result['params']);
		}

		return $result['path'];
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

	private static function handleApiRequest() {
		if (!empty($_GET['api'])) {
			$getRequestParams = self::parseGetRequest(parseJSON(urldecode($_GET['api'])));
		} else {
			$getRequestParams = self::parseGetRequest($_GET);
		}

		Response::setArray(self::handleGetServiceData($getRequestParams));

		if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST') {
			$postRequestParams = [];

			if (isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
				$rawPostData = file_get_contents('php://input');

				$parsedJson = parseJSON($rawPostData);

				if (is_null($parsedJson)) {
					throw new \Engine\Classes\Exceptions\BaseException('Not valid request json');
				}

				$postRequestParams = self::parsePostRequest($parsedJson);
			} else {
				$files = self::transformFiles();
				$postRequestParams = self::parsePostRequest(self::deepMerge($_POST, $files));
			}

			Response::setArray(self::handlePostServiceData($postRequestParams));
		}

		Response::render();
	}

	private static function transformFiles() {
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
		$headers = Response::getRequestHeaders();

		$accept = '*/*';

		if (isset($headers['Accept'])) {
			$accept = strtolower($headers['Accept']);
		}

		if ($route instanceof RouterRoute) {
			$data = $route->getData();
			$template = $route->getTemplate();
			$params = self::handleGetServiceData($data);

			foreach ($params as $key => $value) {
				Response::set($key, $value);
			}

			if (self::isHeaderContainsAnyItem($accept, ['text/html', '*/*'])) {
				echo Templater::render($template, Response::getState());
			}
		} elseif (is_callable($route)) {
			echo $route();
		} else {
			echo $route;
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

	private static function handleGetServiceData($data = [], $inputData = []) {
		$outputData = [];

		foreach ($data as $key => $value) {
			if (gettype($value) === 'object' && $value instanceof ServiceAction) {
				$model = $value->getModel();
				$action = $value->getAction();
				$params = $value->getParams();

				$inputData[$key] = Services::action($model, $action, $params);
				$outputData[$key] = $inputData[$key];
			} elseif (gettype($value) === 'object' && $value instanceof ServiceGet) {
				$model = $value->getModel();
				$params = $value->getParams();

				$inputData[$key] = Services::get($model, $params);
				$outputData[$key] = $inputData[$key];
			} elseif (gettype($value) === 'array') {
				$subData = self::handleGetServiceData($value, $inputData);
				$outputData[$key] = $subData;
			} else {
				$outputData[$key] = $value;
			}
		}

		return $outputData;
	}

	private static function handlePostServiceData($data = [], $inputData = []) {
		if ($data instanceof ServicePost) {
			$model = $data->getModel();
			$params = $data->getParams();

			Services::post($model, $params);

			return [];
		}

		if ($data instanceof ServiceAction) {
			$model = $data->getModel();
			$action = $data->getAction();
			$params = $data->getParams();

			Services::action($model, $action, $params);

			return [];
		}

		$outputData = [];

		foreach ($data as $key => $value) {
			if (gettype($value) === 'object' && $value instanceof ServiceAction) {
				$model = $value->getModel();
				$action = $value->getAction();
				$params = $value->getParams();

				$inputData[$key] = Services::action($model, $action, $params);
				$outputData[$key] = $inputData[$key];
			} elseif (gettype($value) === 'object' && $value instanceof ServicePost) {
				$model = $value->getModel();
				$params = $value->getParams();

				$inputData[$key] = Services::post($model, $params);
				$outputData[$key] = $inputData[$key];
			} elseif (gettype($value) === 'array') {
				$subData = self::handlePostServiceData($value, $inputData);
				$outputData[$key] = $subData;
			} else {
				$outputData[$key] = $value;
			}
		}

		return $outputData;
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
			$preparedKey = preg_replace('/{.*?}/', '*', $key);

			$replaceUri[$preparedKey] = $val;
			$relations[$preparedKey] = $key;
		}

		return [$replaceUri, $relations];
	}

	private static function getUri() {
		return '/' . (count(self::$uri) ? implode('/', self::$uri) . '/' : '');
	}

	private static function parseGetRequest($data) {
		$result = [];

		foreach ($data as $field => $value) {
			if (strpos($field, '[') === false) {
				if ($field === '__action') {
					$params = [];

					if (isset($data['__params'])) {
						$params = $data['__params'];
					}

					$value = explode('/', $value);
					$model = $value[0];
					$action = $value[1];

					return new ServiceAction($model, $action, $params);
				} elseif ($field === '__model') {
					$params = [];

					if (isset($data['__params'])) {
						$params = $data['__params'];
					}

					return new ServiceGet($value, $params);
				} elseif ($field === '__params') {
					continue;
				} elseif (gettype($value) === 'array') {
					$result[$field] = self::parseGetRequest($value);
				}
			}
		}

		return $result;
	}

	private static function parsePostRequest($data) {
		$result = [];

		foreach ($data as $field => $value) {
			if (strpos($field, '[') === false) {
				if ($field === '__action') {
					$params = [];

					if (isset($data['__params'])) {
						$params = $data['__params'];
					}

					$value = explode('/', $value);
					$model = $value[0];
					$action = $value[1];

					return new ServiceAction($model, $action, $params);
				} elseif ($field === '__model') {
					$params = [];

					if (isset($data['__params'])) {
						$params = $data['__params'];
					}

					return new ServicePost($value, $params);
				} elseif ($field === '__params') {
					continue;
				} elseif (gettype($value) === 'array') {
					$result[$field] = self::parsePostRequest($value);
				}
			}
		}

		return $result;
	}

	private static function deepMerge($left, $right) {
		$result = [];

		foreach ($left as $key => $value) {
			if (gettype($value) === 'array') {
				if (isset($right[$key])) {
					if (gettype($right[$key]) === 'array') {
						$result[$key] = self::deepMerge($value, $right[$key]);
					} else {
						$result[$key] = $right[$key];
					}
				} else {
					$result[$key] = $value;
				}
			} else {
				$result[$key] = $value;

				if (isset($right[$key])) {
					$result[$key] = $right[$key];
				}
			}
		}

		foreach ($right as $key => $value) {
			if (isset($result[$key])) {
				if (gettype($result[$key]) === 'array' && gettype($value) === 'array') {
					$result[$key] = self::deepMerge($result[$key], $value);
				} else {
					$result[$key] = $value;
				}
			} else {
				$result[$key] = $value;
			}
		}

		return $result;
	}
}
