<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class ValidateException extends Exception
{
  protected $message;
  protected $originMessage;
  private $errfile = false;
  private $errline = false;

  public function __construct($message = '', $errfile = false, $errline = false) {
    $this->originMessage = $message;

    if ($errfile !== false) $this->errfile = $errfile;
    if ($errline !== false) $this->errline = $errline;
  }

  public function getOriginMessage() {
    return $this->originMessage;
  }

  public function message($withTrace = true) {
    $trace = $this->getTrace();
    $newTrace = [];

    foreach ($trace as $index => $entry) {
      if (!isset($entry['file']) || !isset($entry['line'])) continue;

      $newTrace[] = $entry['file'] . ':' . $entry['line'];
    }

    ob_start();
    echo(join("\n", $newTrace));
    $trace = ob_get_contents();
    ob_end_clean();

    SFResponse::error(422, $this->originMessage, $this->errfile, $this->errline, $trace);
  }
}
