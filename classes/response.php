<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFResponse
{
  private static $state = [];
  private static $template;
  private static $main;
  private static $isShowContent = false;
  private static $code = [
    '200' => 'OK',
    '400' => 'Bad Request',
    '401' => 'Unauthorized',
    '403' => 'Forbidden',
    '404' => 'Not Found',
    '422' => 'Unprocessable Entity',
    '500' => 'Internal Server Error'
  ];
  private static $error = 200;

  public static function error($code, $message, $file = '', $line = '', $trace = false) {
    self::$code = $code;
    header('HTTP/1.1 ' . $code . ' ' . self::$codes[$code]);

    if ($trace === false) {
      $error = new Exception();
      $trace = $error->getTrace();
    }

    self::set('error', [
      'message' => $message,
      'file' => $file . ':' . $line,
      'trace' => $trace
    ]);

    $content = ob_get_contents();
    ob_end_clean();

    self::set('content', $content);

    self::render();
  }

  public static function setStatus($code) {
    header('HTTP/1.1 ' . $code . ' ' . self::$codes[$code]);
  }

  public static function initRedirData() {
    if (isset($_SESSION['redir_data'])) {
      self::$state = array_merge_recursive(self::$state, $_SESSION['redir_data']);
      unset($_SESSION['redir_data']);
    }
  }

  public static function set($field, $value) {
    self::$state[$field] = $value;
  }

  public static function get($name) {
    if (isset(self::$state[$name])) {
      return self::$state[$name];
    }

    return false;
  }

  public static function run($action, $params = []) {
    $urlParams = [];

    foreach ($params as $field => $value) {
      $$field = $value;
    }

    self::set('url_params', implode(N, $urlParams));
    $actionsPath = ROOT;

    if (defined('ACTIONS')) {
      $actionsPath = ACTIONS;
    }

    $isFile = false;
    $isDir = false;
    $action = self::prepareActionPath($action, $isFile, $isDir);

    if (file_exists($action . '.php') && !$isDir) {
      include $action . '.php';
    } elseif (file_exists($actionsPath . $action . '.php') && !$isDir) {
      include $actionsPath . $action . '.php';
    } elseif (file_exists($action) && is_dir($action) && file_exists($action . '/index.php') && !$isFile) {
      include $action . '/index.php';
    } elseif (file_exists($actionsPath . $action) && is_dir($actionsPath . $action) && file_exists($actionsPath . $action . '/index.php') && !$isFile) {
      include $actionsPath . $action . '/index.php';
    } else {
      throw new BaseException('Action file not find: ' . $action . '.php');
      // die('Action file not find: '.$action.'.php');
    }
  }

  public static function actionExists($action) {
    $actionsPath = ROOT;

    if (defined('ACTIONS')) {
      $actionsPath = ACTIONS;
    }

    $isFile = false;
    $isDir = false;
    $action = self::prepareActionPath($action, $isFile, $isDir);

    if (file_exists($action . '.php') && !$isDir) {
      return true;
    } elseif (file_exists($actionsPath . $action . '.php') && !$isDir) {
      return true;
    } elseif (file_exists($action) && is_dir($action) && file_exists($action . '/index.php') && !$isFile) {
      return true;
    } elseif (file_exists($actionsPath . $action) && is_dir($actionsPath . $action) && file_exists($actionsPath . $action . '/index.php') && !$isFile) {
      return true;
    }

    return false;
  }

  public static function getState() {
    return self::$state;
  }

  public static function render() {
    global $startTime;

    $content = '';

    if (ob_get_length()) {
      $content = ob_get_contents();

      if (self::$isShowContent) {
        self::set('content', $content);
      }

      ob_end_clean();
    }

    $headers = self::getRequestHeaders();
    $accept = 'text/html';

    if (isset($headers['Accept'])) {
      $accept = strtolower($headers['Accept']);
    }

    switch ($accept) {
      case 'application/json':
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode(self::$state);

        break;
      case 'text/xml':
      case 'application/xml':
      case 'application/xhtml+xml':
        header('Content-Type: application/xml; charset=utf-8');

        echo '<?xml version="1.0" ?><data>'.self::generateXML(self::$state).'</data>';

        break;
      default:
        if (isset($_SERVER['HTTP_REFERER']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
          $_SESSION['redir_data'] = self::$state;
          self::redir($_SERVER['HTTP_REFERER']);
        } else {
          if (self::$code === 200) {
            echo $content;
            $endTime = explode(' ', microtime());
            $endTime = $endTime[1] + $endTime[0];

            echo '<!-- ' . ($endTime - $startTime) . 's; ' . SFORMDatabase::$countQueries . ' queries -->';
          } else {
            $trace = print_r(self::$state['error']['trace'], true);
            echo '<pre>' . self::$state['error']['message'];
            echo ' at ' . self::$state['error']['file'] . "\n";
            echo $trace . '</pre>';
          }
        }
    }

    die();
  }

  public static function redir($path) {
    $_SESSION['location'] = $path;
    header('Location: /', true, 301);

    die();
  }

  public static function refresh() {
    self::redir($_SERVER['REQUEST_URI']);
  }

  public static function showContent() {
    self::$isShowContent = true;
  }

  private static function prepareActionPath($action, & $isFile, & $isDir) {
    if (substr($action, -1) === '/') {
      $action = substr($action, 0, -1);
      $isDir = true;
    }

    if (substr($action, -4) === '.php') {
      $action = substr($action, 0, -4);
      $isFile = true;
    }

    return $action;
  }

  private static function getRequestHeaders() {
    $headers = array();

    foreach($_SERVER as $key => $value) {
      if (strtolower(substr($key, 0, 5)) !== 'http_') {
        continue;
      }

      $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
      $headers[$header] = $value;
    }

    return $headers;
  }

  private static function generateXML($data) {
    if (gettype($data) === 'array') {
      $result = '';

      foreach($data as $key => $value) {
        if (gettype($key) === 'integer') {
          $result .= '<item>'.self::generateXML($value).'</item>';
        } else {
          $result .= '<'.$key.'>'.self::generateXML($value).'</'.$key.'>';
        }
      }

      return $result;
    }

    return $data;
  }
}
