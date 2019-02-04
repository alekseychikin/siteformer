<?php

class SFORMFunc {
  private $func;

  public function __construct ($func) {
    $this->func = $func;
  }

  public function get () {
    return $this->func;
  }
}
