<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFResponse
  {
    private static $result = array();
    private static $toGlobal = array();
    private static $template;
    private static $type = 'redir';
    private static $main;
    private static $propagation = true;
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
      header('HTTP/1.1 '.$code.' '.self::$code[$code]);
    }

    private static $working = true;

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
        die(json_encode(self::$result));
      }
      self::render();
      self::$working = false;
    }

    public static function setStatus($code)
    {
      header('HTTP/1.1 '.$code.' '.self::$code[$code]);
    }

    public static function initRedirData()
    {
      if (isset($_SESSION['redir_data'])) {
        self::$result = array_merge(self::$result, $_SESSION['redir_data']);
        unset($_SESSION['redir_data']);
      }
    } //

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

    public static function run($action, $params = array())
    {
      if (!self::$working) return false;
      if (in_array(substr($action, strlen($action) - 6), self::$types)) {
        $type = substr($action, strlen($action) - 6);
        SFResponse::setType($type);
        $action = substr($action, 0, strlen($action) - strlen($type) - 1);
      }
      $urlParams = array();
      foreach ($params as $field => $value) {
        $$field = $value;
        // $urlParams[] = '<input type="hidden" id="url_param_'. $field .'" role="url_param_'. $field .'" value="'. $value .'" />';
      }
      SFResponse::set('url_params', implode(N, $urlParams));
      if (file_exists(ACTIONS.$action.'.php')) {
        return include ACTIONS.$action.'.php';
      }
      elseif (file_exists($action.'.php')) {
        return include $action.'.php';
      }
      elseif (file_exists(ACTIONS.$action) && is_dir(ACTIONS.$action) && file_exists(ACTIONS.$action.'/index.php')) {
        return include ACTIONS.$action.'/index.php';
      }
      elseif (file_exists($action) && is_dir($action) && file_exists($action.'/index.php')) {
        return include $action.'/index.php';
      }
      else {
        self::error(404, 'Action file not find: '.$action.'.php');
        // die('Action file not find: '.$action.'.php');
      }
    }

    public static function isActionExists($action)
    {
      if (!self::$working) return false;
      if (in_array(substr($action, strlen($action) - 6), self::$types)) {
        $type = substr($action, strlen($action) - 6);
        $action = substr($action, 0, strlen($action) - strlen($type) - 1);
      }
      if (file_exists(ACTIONS.$action.'.php')) {
        return true;
      }
      elseif (file_exists($action.'.php')) {
        return true;
      }
      elseif (file_exists(ACTIONS.$action) && is_dir(ACTIONS.$action) && file_exists(ACTIONS.$action.'/index.php')) {
        return true;
      }
      elseif (file_exists($action) && is_dir($action) && file_exists($action.'/index.php')) {
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

    public static function returnData($content = '')
    {
      if (!self::$working) return false;
      $type = self::$type;
      if ($type == '__json') {
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
