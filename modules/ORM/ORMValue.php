<?php

namespace Engine\Modules\ORM;

class ORMValue {
  private $expr;

  public function __construct($expr) {
    $this->expr = $expr;
  }

  public function get() {
    return $this->expr;
  }
}
