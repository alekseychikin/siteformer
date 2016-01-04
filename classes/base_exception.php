<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class BaseException extends Exception
  {
    protected $message;
    private $errfile = false;
    private $errline = false;

    public function __construct($message, $errfile = false, $errline = false)
    {
      $this->message = $message;
      if ($errfile !== false) $this->errfile = $errfile;
      if ($errline !== false) $this->errline = $errline;
    }

    public function message($withTrace = true)
    {
      $trace = $this->getTrace();
      $newTrace = array();
      foreach ($trace as $index => $entry) {
        if (!isset($entry['file']) || !isset($entry['line'])) continue;
        $newTrace[] = $entry['file'] . ':' . $entry['line'];
      }
      ob_start();
      print_r($newTrace);
      $trace = ob_get_contents();
      ob_end_clean();
      $message = $this->message . ($this->errfile ? ' at file' . $this->errfile . ':' . $this->errline : '') . ($withTrace ? "\n" . $trace : '');
      return $message;
    }
  }

?>
