<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFLog
  {
    private static $lines = array();
    private static $starttime;
    private static $checktime;
    private static $initialized = false;

    public static function init()
    {
      self::$initialized = true;
      self::$checktime = microtime(true);
      self::$starttime = self::$checktime;
      self::write('------START SECTION-------', $_SERVER['SERVER_PROTOCOL'] . ' ' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    }

    public static function write()
    {
      if (!self::$initialized) return false;
      $line = implode("\n", func_get_args());
      $e = new Exception();
      $trace = $e->getTrace();
      $time = microtime(true);
      $line = $line . ' (+' . number_format($time - self::$checktime, 4) . 's)' . "\n" . $trace[0]['file'] . ':' . $trace[0]['line'] . "\n\n";
      self::$checktime = $time;
      $file = fopen(TEMP.'log.txt', 'a');
      fputs($file, $line);
      fclose($file);
    }

    public static function close()
    {
      if (!self::$initialized) return false;
      $time = microtime(true);
      self::write('Total time: ' . number_format($time - self::$starttime, 4) . 's', '------END SECTION-------');
    }

  }

?>
