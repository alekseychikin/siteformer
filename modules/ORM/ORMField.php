<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFORMField
{
  private $field;

  public function __construct ($field) {
    $this->field = $field;
  }

  public function get () {
    return $this->field;
  }
}
