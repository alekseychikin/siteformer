<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  if (SFResponse::actionExists(MODULES . 'ERM/types/' . $type . '/' . $handle)) {
    SFResponse::run(MODULES . 'ERM/types/' . $type . '/' . $handle);
  }

?>
