<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFRouter
  {
    private static $uri;
    private static $routingPath;
    private static $num_page = 1;
    private static $beforeParams = array();
    public static $languages = array();
    private static $language = '';

    public static function __after()
    {
      SFLog::write('Begin __after module SFRouter');
      $result = self::parse();
      if (!$result) return false;
      SFLog::write('Done parse');
      if (SFResponse::actionExists(ACTIONS . '__before.php')) {
        SFResponse::run(ACTIONS . '__before');
      }
      SFLog::write('Done __before.php at module SFRouter');
      SFResponse::run($result['path'], $result['params']);
      SFLog::write('Runed ' . $result['path'] . ' at module SFRouter');
      SFResponse::close();
      SFLog::write('Ends __after module SFRouter');
    }

    public static function addRule($url, $action)
    {
      self::$beforeParams[$url] = $action;
    }

    public static function init($params)
    {
      SFLog::write('Init module SFRouter');
      self::$routingPath = $params['rotes'];
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
      $uri = array();
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
        SFResponse::set('lang', '/'.self::$language, true);
      }
      else if (count(self::$languages)) {
        self::$language = self::$languages[0];
      }
      if (substr(self::uri(self::uriNum() - 1), 0, 2) == '__') {
        if (in_array(self::uri(self::uriNum() - 1), SFResponse::$types)) {
          SFResponse::setType(self::uri(self::uriNum() - 1));
          unset(self::$uri[self::uriNum() - 1]);
          if (substr($_SERVER['REQUEST_URI'], strlen($_SERVER['REQUEST_URI']) - 1, 1) == '/') {
            $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], 0, strlen($_SERVER['REQUEST_URI']) - 1);
          }
          $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], 0, strrpos($_SERVER['REQUEST_URI'], '/')).'/';
        }
      }
      // if (preg_match("/^page(\d{1,})$/", self::uri(self::uriNum() - 1))) {
      // 	self::$num_page = (int) substr(self::uri(self::uriNum() - 1), 4);
      // 	unset(self::$uri[self::uriNum() - 1]);
      // }
      if (strpos($_SERVER['REQUEST_URI'], '?') !== false) {
        $_SERVER['REQUEST_URI'];
        $get = substr($_SERVER['REQUEST_URI'], strpos($_SERVER['REQUEST_URI'], '?') + 1);
        $get = explode('&', $get);
        foreach ($get as $val) {
          $key = explode('=', $val);
          if (isset($key[1])) {
            $_GET[$key[0]] = $key[1];
          }
          else {
            $_GET[$key[0]] = '';
          }
        }
      }
      $_SERVER['REQUEST_URI'] = '/'.implode('/', self::$uri).'/';
      if ($_SERVER['REQUEST_URI'] == '//') {
        $_SERVER['REQUEST_URI'] = '/';
      }
      SFLog::write('Init module SFRouter');
    }

    public static function language()
    {
      return self::$language;
    }

    public static function defaultLanguage()
    {
      return self::$languages[0];
    } // defaultLanguage

    public static function parse()
    {
      $url = self::getUri();
      if (substr($url, -1, 1) == '/') $url = substr($url, 0, -1);
      if (SFResponse::actionExists($url)) {
        return array('pattern' => '', 'path' => $url, 'params' => array());
      }
      $params = include self::$routingPath;
      $params = array_merge($params, self::$beforeParams);
      if (isset($params[self::getUri()])) {
        return array('pattern' => self::getUri(),
                     'path' => $params[self::getUri()], 'params' => array());
      }
      else {
        $t = true;
        $n = self::uriNum() - 1;
        $a = 1;
        $i = $n;
        // find out all pairs of stars-keys => path-to-controller
        // relations contains connection of starts-key to origin key with variables
        list($pairs, $relations) = self::parseUriReplace($params);
        // print_r($pairs);
        // getting array of uri
        $uri = self::getUriByArray($n);
        // get a string with stars
        $compuri = self::recParsive($pairs, $uri, $a, $n);
        // find out the path to controller by starts-key
        if (isset($pairs[$compuri])) {
          // get original key with variables by starts-key
          $pattern = $relations[$compuri];
          $uri = explode('/', $pattern);
          $params = array();
          foreach ($uri as $key => $val) {
            if (strpos($val, '{') === 0 && strrpos($val, '}') === strlen($val) -1) {
              // make a variables
              $field = substr($val, 1, strlen($val) -2);
              $param = self::uri($key -1);
              $params[$field] = $param;
//							$$field = $param;
            }
          }
          return array('pattern' => $pattern, 'path' => $pairs[$compuri], 'params' => $params);
        }
      }
      return false;
    }

    private static function recParsive($params, & $uri, $start, $n)
    {
      foreach ($params as $pattern => $actionPath) {
        $pattern = explode('/', $pattern);
        $pattern = arrFilter($pattern, function ($value)
        {
          return strlen($value);
        });
        if(count($pattern) && count($pattern) == count($uri)) {
          $t = true;
          for ($i = 0; $i < count($pattern); $i++) {
            if ($pattern[$i] != '*' && $pattern[$i] != $uri[$i]) {
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

    private static function parseUriReplace($uri)
    {
      $replace_uri = array();
      $relations = array();
      foreach ($uri as $key => $val) {
        $new_key = $key;
        while (strpos($new_key, '{') !== false && strpos($new_key, '}') !== false && strpos($new_key, '{') < strpos($new_key, '}')) {
          $new_key = substr($new_key, 0, strpos($new_key, '{')).'*'.substr($new_key, strpos($new_key, '}') + 1);
        }
        $replace_uri[$new_key] = $val;
        $relations[$new_key] = $key;
      }
      return array($replace_uri, $relations);
    }

    public static function getUriByArray($num = 0)
    {
      if ($num != 0) {
        $uri = array();
        for ($i = 0; $i <= $num; $i++) {
          $uri[$i] = self::$uri[$i];
        }
        return $uri;
      }
      return self::$uri;
    }

    private static function getUri()
    {
      if (func_num_args() == 1) {
        $length = func_get_arg(0);
        if ($length > self::uriNum()) {
          $length = self::uriNum();
        }
        $uri = '/';
        for ($i = 0; $i < $length; $i++) {
          $uri .= self::uri($i).'/';
        }
        return $uri;
      }
      elseif (func_num_args() == 2) {
        $length = func_get_arg(0);
        $stars = func_get_arg(1);
        $uri = '/';
        for ($i = 0; $i < $length - $stars; $i++) {
          $uri .= self::uri($i).'/';
        }
        for ($i = 0; $i <= $stars; $i++) {
          $uri .= '*/';
        }
        return $uri;
      }
      elseif (func_num_args() == 3) {
        $length = func_get_arg(0);
        $stars = func_get_arg(1);
        $start = func_get_arg(2);
        $uri = '/';
  //			echo $length.' '.$stars.' '.$start;
        for ($i = 0; $i < $length - $stars - $start + 1; $i++) {
          $uri .= self::uri($i).'/';
        }
        for ($i = 0; $i < $stars; $i++) {
          $uri .= '*/';
        }
        for ($i = $length - $start + 1; $i <= $length; $i++) {
          $uri .= self::uri($i).'/';
        }
        return $uri;
      }
      else {
        if (self::uriNum() > 0) {
          return '/'.implode('/', self::$uri).'/';
        }
        else {
          return '/';
        }
      }
    }

    public static function uri($item = false)
    {
      if ($item !== false) {
        if (isset(self::$uri[$item])) {
          return self::$uri[$item];
        }
        else {
          return false;
        }
      }
      else {
        return self::$uri;
      }
    }

    public static function uriNum()
    {
      return count(self::$uri);
    }

  }


?>
