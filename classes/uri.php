<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFURI
  {
    private static $init = false;
    private static $uri = array();
    private static $port = 80;
    private static $name = '';

    public static function init()
    {
      if (self::$init) return false;
      self::$init = true;
      $uri = array();
      if (isset($_GET['q'])) {
        $uriRaw = rawurldecode($_GET['q']);
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
        self::$uri = $uri;
        SFResponse::set('uri', self::$uri, true);
        unset($_GET['q']);
      }
      self::$port = $_SERVER['SERVER_PORT'];
      self::$name = explode('.', $_SERVER['SERVER_NAME']);
    }

    public static function getUri($item = false)
    {
      self::init();
      if ($item === false) return '/'.implode('/', self::$uri).(count(self::$uri) > 0 ? '/' : '');
      if (isset(self::$uri[$item])) return self::$uri[$item];
      return false;
    }

    public static function getUriRaw()
    {
      self::init();
      return self::$uri;
    }

    public static function getLastUri($item = false)
    {
      self::init();
      return self::getUri(self::getUriLength() - 1);
    }

    public static function getFirstUri($item = false)
    {
      self::init();
      return self::getUri(0);
    }

    public static function getUriLength()
    {
      self::init();
      return count(self::$uri);
    }

    public static function getDomain($item = false)
    {
      self::init();
      if ($item === false) return implode('.', self::$name);
      if (isset(self::$name[$item])) return self::$name[$item];
      return false;
    }

    public static function getLastDomain($item = false)
    {
      self::init();
      return self::getDomain(self::getDomainsLength() - 1);
    }

    public static function getFirstDomain($item = false)
    {
      self::init();
      return self::getDomain(0);
    }

    public static function getDomainsLength()
    {
      self::init();
      return count(self::$name);
    }

    public static function getPort()
    {
      self::init();
      return self::$port;
    }
  }

?>
