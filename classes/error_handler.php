<?php

function fatalErrorHandler() {
  $error = error_get_last();

  if ($error !== null) {
    errorHandler(500, $error['message'], $error['file'], $error['line']);
  }
}

function errorHandler($errno, $errstr = '', $errfile = null, $errline = null) {
  $error = new Exception();
  $trace = $error->getTrace();

  SFResponse::error(500, 'Fatal error: ' . $errstr,  $errfile, $errline, $trace);
}

function exceptionHandler($exception) {
  $trace = $exception->getTrace();

  throw new BaseException($exception->getMessage(), $trace[0]['file'], $trace[0]['line']);
}
