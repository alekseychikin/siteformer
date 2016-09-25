<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFResponse
  {
    private static $result = [];
    private static $toGlobal = [];
    private static $template;
    private static $main;
    private static $propagation = true;
    private static $working = true;
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
    private static $stopsCodes = [
      '400', '401', '402', '403', '404', '422', '500'
    ];
    private static $error = 200;

    public static function code($code) {
      self::$error = $code;
      header('HTTP/1.1 ' . $code . ' ' . self::$code[$code]);
    }

    public static function isWorking() {
      return self::$working;
    }

    public static function error($status, $message) {
      self::code($status);

      $error = new Exception();
      $trace = $error->getTrace();

      self::set('error', ['message' => $message, 'trace' => $trace]);

      $content = ob_get_contents();
      ob_end_clean();

      self::set('content', $content);

      self::render();
    }

    public static function setStatus($code) {
      header('HTTP/1.1 ' . $code . ' ' . self::$code[$code]);
    }

    public static function initRedirData() {
      if (isset($_SESSION['redir_data'])) {
        self::$result = array_merge(self::$result, $_SESSION['redir_data']);
        unset($_SESSION['redir_data']);
      }
    }

    public static function isPropagation() {
      return self::$propagation;
    }

    public static function stopPropagation() {
      self::$propagation = false;
    }

    public static function set($name, $result, $toGlobal = false) {
      if ($toGlobal) {
        self::$toGlobal[$name] = $result;
      }

      self::$result[$name] = $result;
    }

    public static function get($name) {
      if (isset(self::$result[$name])) {
        return self::$result[$name];
      }

      return false;
    }

    public static function getGlobal() {
      return self::$toGlobal;
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

    public static function run($action, $params = []) {
      if (!self::$working) return false;

      $urlParams = [];

      foreach ($params as $field => $value) {
        $$field = $value;
        // $urlParams[] = '<input type="hidden" id="url_param_'. $field .'" role="url_param_'. $field .'" value="'. $value .'" />';
      }

      SFResponse::set('url_params', implode(N, $urlParams));
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
      if (!self::$working) return false;

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

    public static function template($template) {
      self::$template = $template;
    }

    public static function main($main) {
      self::$main = $main;
    }

    public static function getResults() {
      return self::$result;
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

    private static function returnData() {
      if (!self::$working) return false;

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
        $accept = $headers['Accept'];
      }

      switch ($accept) {
        case 'application/json':
          header('Content-Type: application/json; charset=utf-8');

          echo json_encode(self::$result);

          break;
        case 'text/xml':
        case 'application/xml':
        case 'application/xhtml+xml':
          header('Content-Type: application/xml; charset=utf-8');

          echo '<?xml version="1.0" ?><data>'.self::generateXML(self::$result).'</data>';

          break;
        default:
          if (isset($_SERVER['HTTP_REFERER']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $_SESSION['redir_data'] = self::$result;
            self::redir($_SERVER['HTTP_REFERER']);
          } else {
            if (self::$error === 200) {
              echo $content;
            } else {
              $trace = print_r(self::$result['error']['trace'], true);
              echo self::$result['error']['message'] . "\n" . $trace;
            }
          }
      }

      die();

      self::$working = false;
    }

    public static function render() {
      if (!self::$working) return false;

      self::returnData();
    }

    public static function redir($path) {
      if (!self::$working) return false;

      $_SESSION['location'] = $path;
      header('Location: /', true, 301);

      die();
    }

    public static function refresh() {
      if (!self::$working) return false;

      self::redir($_SERVER['REQUEST_URI']);
    }

    public static function showContent() {
      self::$isShowContent = true;
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
