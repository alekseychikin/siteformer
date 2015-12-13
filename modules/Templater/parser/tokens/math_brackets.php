<?php

  class MathBrackets
  {
    private $expr;

    public function __construct($expr)
    {
      $this->expr = $expr;
    }

    public function expr()
    {
      return $this->expr;
    }
  }

?>
