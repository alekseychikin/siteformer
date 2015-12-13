<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once __DIR__.'/response.php';

  class SFURI
  {
    private static $init = false;
    private static $uri = array();
    private static $port = 80;
    private static $name = '';

    public static function init($path, $domain = '', $port = '')
    {
      self::$init = true;
      $uri = array();
      $uriRaw = rawurldecode($path);
      $getRaw = '';
      if (strpos($uriRaw, '?') !== false) {
        $getRaw = substr($uriRaw, strpos($uriRaw, '?') + 1);
        $uriRaw = substr($uriRaw, 0, strpos($uriRaw, '?'));
      }
      $uriRaw = explode('/', $uriRaw);
      $uri = array();
      $max = 10;
      $i = 1;
      foreach ($uriRaw as $key => $val) {
        if ($i++ <= $max) {
          if (!empty($val)) {
            $uri[] = $uriRaw[$key];
          }
        }
      }
      if (!count($uri)) {
        $uri[] = '/';
      }
      self::$uri = $uri;
      SFResponse::set('uri', self::$uri, true);
      if (isset($_GET['q'])) unset($_GET['q']);
      self::$port = $port;
      self::$name = explode('.', $domain);
    }

    public static function getUri($item = false)
    {
      if ($item === false) return implode('/', self::$uri).(count(self::$uri) < 1 ? '/' : '');
      if (isset(self::$uri[$item])) return self::$uri[$item];
      return false;
    }

    public static function getUriRaw()
    {
      return self::$uri;
    }

    public static function getLastUri($item = false)
    {
      return self::getUri(self::getUriLength() - 1);
    }

    public static function getFirstUri($item = false)
    {
      return self::getUri(0);
    }

    public static function getUriLength()
    {
      return count(self::$uri);
    }

    public static function getDomain($item = false)
    {
      if ($item === false) return implode('.', self::$name);
      if (isset(self::$name[$item])) return self::$name[$item];
      return false;
    }

    public static function getLastDomain($item = false)
    {
      return self::getDomain(self::getDomainsLength() - 1);
    }

    public static function getFirstDomain($item = false)
    {
      return self::getDomain(0);
    }

    public static function getDomainsLength()
    {
      return count(self::$name);
    }

    public static function getPort()
    {
      return self::$port;
    }
  }

  if (isset($_GET['q'])) {
    SFURI::init($_GET['q'], $_SERVER['SERVER_NAME'], $_SERVER['SERVER_PORT']);
  }

?>
