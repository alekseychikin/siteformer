<?php

  class MathNumber
  {
    private $expr;

    public function __construct($expr)
    {
      $this->expr = $expr;
    }

    public function value()
    {
      return $this->expr;
    }
  }

?>
