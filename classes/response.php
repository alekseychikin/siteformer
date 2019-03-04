<?php

class SFResponse {
  private static $state = [];
  private static $template;
  private static $main;
  private static $codes = [
    '200' => 'OK',
    '400' => 'Bad Request',
    '401' => 'Unauthorized',
    '403' => 'Forbidden',
    '404' => 'Not Found',
    '422' => 'Unprocessable Entity',
    '500' => 'Internal Server Error'
  ];
  private static $code = 200;

  public static function error($code, $message) {
    self::$code = $code;
    header('HTTP/1.1 ' . $code . ' ' . self::$codes[$code]);

    self::set('error', $message);

    $content = ob_get_contents();
    ob_end_clean();

    self::set('content', $content);

    self::render();
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

  public static function getState() {
    return self::$state;
  }

  public static function render() {
    global $startTime;

    $content = '';

    if (ob_get_length()) {
      $content = ob_get_contents();

      if (strlen($content)) {
        self::set('debug', $content);
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

        $state = self::$state;

        if (self::$code !== 200) {
          $state = [
            'error' => self::$state['error']
          ];

          if (strlen(self::$state['content'])) {
            $state['debug'] = self::$state['content'];
          }
        }

        echo json_encode($state);

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
          self::redirect($_SERVER['HTTP_REFERER']);
        } else {
          if (self::$code === 200) {
            echo $content;
          } else {
            $state = [
              'error' => self::$state['error'],
              'debug' => self::$state['content']
            ];

            if (gettype($state['error']) === 'array' && isset($state['error']['message'])) {
              echo $state['error']['message'] . "\n<br/><br/>\n";

              if (isset($state['error']['trace'])) {
                echo '<pre>' . print_r($state['error']['trace'], true) . '</pre>';
              }
            } else {
              println($state['error']);
            }
          }
        }
    }

    die();
  }

  public static function redirect($path) {
    header('Location: ' . $path, true, 301);

    die();
  }

  public static function refresh() {
    self::redirect($_SERVER['REQUEST_URI']);
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

  public static function getRequestHeaders() {
    $headers = [];

    foreach($_SERVER as $key => $value) {
      $header = str_replace(' ', '-', ucwords(str_replace(['_', '-'], ' ', strtolower($key))));

      if (strtolower(substr($key, 0, 5)) === 'http_') {
        $a = str_replace(['_', '-'], ' ', strtolower(substr($key, 5)));
        $header = str_replace(' ', '-', ucwords(str_replace(['_', '-'], ' ', strtolower(substr($key, 5)))));
      }

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
