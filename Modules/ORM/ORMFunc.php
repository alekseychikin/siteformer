<?php

namespace Engine\Modules\ORM;

class ORMFunc {
  private $func;

  public function __construct ($func) {
    $this->func = $func;
  }

  public function get () {
    return $this->func;
  }
}
