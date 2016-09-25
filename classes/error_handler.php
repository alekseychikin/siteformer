<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  function fatalErrorHandler() {
    $error = error_get_last();

    if ($error !== null) {
      errorHandler(500, $error['message'], $error['file'], $error['line']);
    }
  }

  function errorHandler($errno, $errstr = '', $errfile = null, $errline = null) {
    SFResponse::error(500, 'Fatal error: ' . $errstr . ' at ' . $errfile . ':' . $errline);
  }

  function exceptionHandler($exception) {
    $trace = $exception->getTrace();

    throw new BaseException($exception->getMessage(), $trace[0]['file'], $trace[0]['line']);
  }

?>
