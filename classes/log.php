<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFLog
  {
    private static $lines = array();

    public static function write($line)
    {
      $e = new Exception;
      $trace = $e->getTrace();
      $line = $trace[0]['file'].':'.$trace[0]['line'].': '.$line."\n";
      $file = fopen(TEMP.'log.txt', 'a');
      fputs($file, $line);
      fclose($file);
    }

  }

?>
