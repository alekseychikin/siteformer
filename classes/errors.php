<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFError
{
  public function __construct($error) {
    die($error);
  }
}
