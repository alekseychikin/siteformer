<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFResponse
  {
    private static $result = array();
    private static $toGlobal = array();
    private static $template;
    private static $type = 'redir';
    private static $main;
    private static $propagation = true;
    private static $working = true;
    private static $code = array(
      '200' => 'OK',
      '401' => 'Unauthorized',
      '403' => 'Forbidden',
      '404' => 'Not Found',
      '422' => 'Unprocessable Entity'
    );
    private static $stopsCodes = array(
      '401', '402', '403', '404', '422'
    );
    public static $types = array('__json', '__print', '__xml');

    public static function code($code)
    {
      header('HTTP/1.1 ' . $code . ' ' . self::$code[$code]);
    }

    public static function error($status, $message)
    {
      if (!self::$working) return false;
      self::code($status);
      if (gettype($message) == 'array') {
        self::$result = array_merge(self::$result, $message);
      }
      else {
        self::set('error', $message);
      }
      if (in_array($status, self::$stopsCodes)) {
        header('Content-Type: application/json; charset=utf8');
        die(json_encode(self::$result));
      }
      self::render();
      self::$working = false;
    }

    public static function setStatus($code)
    {
      header('HTTP/1.1 ' . $code . ' ' . self::$code[$code]);
    }

    public static function initRedirData()
    {
      if (isset($_SESSION['redir_data'])) {
        self::$result = array_merge(self::$result, $_SESSION['redir_data']);
        unset($_SESSION['redir_data']);
      }
    }

    public static function isPropagation()
    {
      return self::$propagation;
    }

    public static function stopPropagation()
    {
      self::$propagation = false;
    }

    public static function set($name, $result, $toGlobal = false)
    {
      if ($toGlobal) {
        self::$toGlobal[$name] = $result;
      }
      self::$result[$name] = $result;
    }

    public static function get($name)
    {
      if (isset(self::$result[$name])) {
        return self::$result[$name];
      }
      return false;
    }

    public static function getGlobal()
    {
      return self::$toGlobal;
    }

    private static function prepareActionPath($action, & $isFile, & $isDir)
    {
      if (substr($action, -1) == '/') {
        $action = substr($action, 0, -1);
        $isDir = true;
      }
      if (substr($action, -4) == '.php') {
        $action = substr($action, 0, -4);
        $isFile = true;
      }
      if (strpos($action, '/__') !== false) {
        $type = substr($action, strrpos($action, '__'));
        if (in_array($type, self::$types)) {
          $action = substr($action, 0, strlen($action) - strlen($type) - 1);
          $isDir = false;
        }
      }
      return $action;
    }

    public static function run($action, $params = array())
    {
      if (!self::$working) return false;

      $urlParams = array();
      foreach ($params as $field => $value) {
        $$field = $value;
        // $urlParams[] = '<input type="hidden" id="url_param_'. $field .'" role="url_param_'. $field .'" value="'. $value .'" />';
      }
      SFResponse::set('url_params', implode(N, $urlParams));
      if (file_exists(ACTIONS . $action . '.php')) {
        return include ACTIONS . $action . '.php';
      }
      elseif (file_exists($action . '.php')) {
        return include $action . '.php';
      }
      elseif (file_exists(ACTIONS . $action) && is_dir(ACTIONS . $action) && file_exists(ACTIONS . $action . '/index.php')) {
        return include ACTIONS . $action . '/index.php';
      }
      elseif (file_exists($action) && is_dir($action) && file_exists($action . '/index.php')) {
        return include $action . '/index.php';
      }
      else {
        self::error(404, 'Action file not find: ' . $action . '.php');
        // die('Action file not find: '.$action.'.php');
      }
    }

    public static function isActionExists($action)
    {
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
      }
      elseif (file_exists($actionsPath . $action . '.php') && !$isDir) {
        return true;
      }
      elseif (file_exists($action) && is_dir($action) && file_exists($action . '/index.php') && !$isFile) {
        return true;
      }
      elseif (file_exists($actionsPath . $action) && is_dir($actionsPath . $action) && file_exists($actionsPath . $action . '/index.php') && !$isFile) {
        return true;
      }
      return false;
    }

    public static function setType($type)
    {
      self::$type = $type;
    }

    public static function template($template)
    {
      self::$template = $template;
    }

    public static function main($main)
    {
      self::$main = $main;
    }

    public static function getResults()
    {
      return self::$result;
    }

    private static function returnData($content = '')
    {
      if (!self::$working) return false;
      $type = self::$type;
      if ($type == '__json') {
        header('Content-Type: application/json; charset=utf8');
        echo json_encode(self::$result);
      }
      elseif ($type == '__print') {
        print_r(self::$result);
      }
      else {
        if (!empty($content)) {
          echo $content;
        }
        else {
          if (isset($_SERVER['HTTP_REFERER'])) {
            $_SESSION['redir_data'] = self::$result;
            self::redir($_SERVER['HTTP_REFERER']);
          }
          else {
            print_r(self::$result);
            self::$working = false;
          }
        }

      }
    } // returnData

    public static function render($content = '')
    {
      if (!self::$working) return false;
      self::returnData($content);
    }

    public static function redir($path)
    {
      if (!self::$working) return false;
      $_SESSION['location'] = $path;
      header('Location: /', true, 301);
      die();
    }

    public static function refresh()
    {
      if (!self::$working) return false;
      self::redir($_SERVER['REQUEST_URI']);
    }

    public static function close()
    {
      self::$working = false;
    }
  }
