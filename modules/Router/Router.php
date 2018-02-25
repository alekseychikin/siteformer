<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../classes/uri.php';
require_once __DIR__ . '/../../classes/response.php';
require_once __DIR__ . '/../../classes/models.php';
require_once __DIR__ . '/RouterModel.php';

class SFRouter
{
  public static $languages = [];
  private static $uri;
  private static $num_page = 1;
  private static $routes = [];
  private static $language = '';
  private static $modelsPath = false;

  public static function init($params) {
    self::$routes = $params['routes'];

    if (is_callable($params['routes'])) {
      self::$routes = $params['routes'](SFURI::getUri());
    }

    if (isset($params['models'])) {
      SFModels::registerPath(SFPath::prepareDir($params['models']));
    }

    if (isset($params['languages'])) {
      self::$languages = $params['languages'];
    }

    SFResponse::set('lang', '', true);
    SFResponse::set('uri', SFURI::getUri());
    $uri = SFURI::getUriRaw();

    foreach ($uri as $index => $item) {
      if (empty($item)) {
        unset($uri[$index]);
      }
    }

    SFResponse::set('uri_items', $uri);
    self::$uri = $uri;
    $uri = [];
    $max = 10;
    $i = 1;

    foreach (self::$uri as $key => $val) {
      if ($i <= $max) {
        if (!empty($val)) {
          $uri[] = self::$uri[$key];
          $i++;
        }
      }
    }

    self::$uri = $uri;

    if (isset(self::$uri[0]) && in_array(self::$uri[0], self::$languages)) {
      self::$language = self::$uri[0];
      self::$uri = array_splice(self::$uri, 1);
      SFResponse::set('lang', '/' . self::$language, true);
    } else if (count(self::$languages)) {
      self::$language = self::$languages[0];
    }

    if (strpos($_SERVER['REQUEST_URI'], '?') !== false) {
      $_SERVER['REQUEST_URI'];
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

    $_SERVER['REQUEST_URI'] = '/' . implode('/', self::$uri) . '/';

    if ($_SERVER['REQUEST_URI'] == '//') {
      $_SERVER['REQUEST_URI'] = '/';
    }
  }

  public static function route() {
    $url = self::getUri();

    if ($url === '/' && isset($_GET['graph'])) {
      self::returnModelData(parseJSON(urldecode($_GET['graph'])));

      return true;
    }

    $result = self::parse($url);

    if (!$result) return false;

    if (gettype($result['path']) === 'string') {
      if (SFResponse::actionExists($result['path'])) {
        SFResponse::run($result['path'], $result['params']);

        return true;
      }
    } else {
      self::runAction($result['path'], $result['params']);

      return true;
    }

    return false;
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

  public static function uri($item = false) {
    if ($item !== false) {
      if (isset(self::$uri[$item])) {
        return self::$uri[$item];
      } else {
        return false;
      }
    } else {
      return self::$uri;
    }
  }

  public static function uriNum() {
    return count(self::$uri);
  }

  private static function returnModelData($params) {
    if (!$params) {
      $params = [];
    }

    if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST') {
      foreach ($_POST as $key => $value) {
        SFResponse::set($key, SFModels::post($key, $value));
      }

      foreach ($_FILES as $key => $value) {
        SFResponse::set($key, SFModels::files($key, $value));
      }
    }

    $params = self::prepareGetParams($params);

    foreach ($params as $key => $value) {
      SFResponse::set($key, $value);
    }

    SFResponse::render();
  }

  private static function runAction($data, $params) {
    if (isset($data['data'])) {
      $params = self::prepareGetParams($data['data'], $params);

      foreach ($params as $key => $value) {
        SFResponse::set($key, $value);
      }
    }

    $headers = SFResponse::getRequestHeaders();
    $accept = 'text/html';

    if (isset($headers['Accept'])) {
      $accept = strtolower($headers['Accept']);
    }

    if (isset($data['template']) && strpos($accept, 'text/html') !== false) {
      echo SFTemplater::render($data['template'], SFResponse::getState());
    }
  }

  private static function prepareGetParams($rules = [], $inputData = []) {
    $outputData = [];

    foreach ($rules as $key => $value) {
      if (gettype($value) === 'array') {
        $subData = self::prepareGetParams($value, $inputData);
        $outputData[$key] = $subData;
      } else {
        list($model, $options) = self::parseSource($value, $inputData);
        $inputData[$key] = self::getDataFromModel($model, $options);
        $outputData[$key] = $inputData[$key];
      }
    }

    return $outputData;
  }

  private static function getDataFromModel($model, $params) {
    return SFModels::get($model, $params);
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

  private static function parse($url) {
    if (substr($url, -1, 1) == '/') $url = substr($url, 0, -1);

    $uri = self::getUri();

    if (isset(self::$routes[$uri])) {
      return [
        'pattern' => $uri,
        'path' => self::$routes[$uri], 'params' => []
      ];
    } else {
      $t = true;
      $n = self::uriNum() - 1;
      $a = 1;
      $i = $n;

      // find out all pairs of stars-keys => path-to-controller
      // relations contains connection of starts-key to origin key with variables
      list($pairs, $relations) = self::parseUriReplace(self::$routes);

      // getting array of uri
      $uri = self::getUriByArray($n);

      // get a string with stars
      $compuri = self::recParsive($pairs, $uri, $a, $n);

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

    return false;
  }

  private static function recParsive($params, & $uri, $start, $n) {
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

  private static function parseUriReplace($uri) {
    $replace_uri = [];
    $relations = [];

    foreach ($uri as $key => $val) {
      $new_key = $key;

      while (strpos($new_key, '{') !== false && strpos($new_key, '}') !== false && strpos($new_key, '{') < strpos($new_key, '}')) {
        $new_key = substr($new_key, 0, strpos($new_key, '{')) . '*' . substr($new_key, strpos($new_key, '}') + 1);
      }

      $replace_uri[$new_key] = $val;
      $relations[$new_key] = $key;
    }

    return [$replace_uri, $relations];
  }

  private static function getUriByArray($num = 0) {
    if ($num != 0) {
      $uri = [];

      for ($i = 0; $i <= $num; $i++) {
        $uri[$i] = self::$uri[$i];
      }

      return $uri;
    }

    return self::$uri;
  }

  private static function getUri() {
    if (func_num_args() == 1) {
      $length = func_get_arg(0);

      if ($length > self::uriNum()) {
        $length = self::uriNum();
      }

      $uri = '/';

      for ($i = 0; $i < $length; $i++) {
        $uri .= self::uri($i) . '/';
      }

      return $uri;
    } elseif (func_num_args() == 2) {
      $length = func_get_arg(0);
      $stars = func_get_arg(1);
      $uri = '/';

      for ($i = 0; $i < $length - $stars; $i++) {
        $uri .= self::uri($i) . '/';
      }

      for ($i = 0; $i <= $stars; $i++) {
        $uri .= '*/';
      }

      return $uri;
    } elseif (func_num_args() == 3) {
      $length = func_get_arg(0);
      $stars = func_get_arg(1);
      $start = func_get_arg(2);
      $uri = '/';

      for ($i = 0; $i < $length - $stars - $start + 1; $i++) {
        $uri .= self::uri($i) . '/';
      }

      for ($i = 0; $i < $stars; $i++) {
        $uri .= '*/';
      }

      for ($i = $length - $start + 1; $i <= $length; $i++) {
        $uri .= self::uri($i) . '/';
      }

      return $uri;
    } else {
      if (self::uriNum() > 1 || self::$uri[0] !== '/') {
        return '/' . implode('/', self::$uri) . '/';
      } else {
        return '/';
      }
    }
  }
}
