<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  if (SFResponse::actionExists(MODULES . 'GUI/types/' . $type . '/' . $handle)) {
    SFResponse::run(MODULES . 'GUI/types/' . $type . '/' . $handle);
  }

?>
