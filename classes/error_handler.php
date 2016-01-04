<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  function errorHandler($errno, $errstr, $errfile, $errline)
  {
    if (!(error_reporting() & $errno)) {
      return ;
    }

    throw new BaseException($errstr, $errfile, $errline);

    return true;
  }

?>
