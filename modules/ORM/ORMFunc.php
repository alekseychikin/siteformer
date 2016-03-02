<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFORMFunc
{
  private $func;

  public function __construct ($func) {
    $this->func = $func;
  }

  public function get () {
    return $this->func;
  }
}
