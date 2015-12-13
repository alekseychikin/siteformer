<?php

  class LogicNode
  {
    private $expressions;

    public function __construct($expressions)
    {
      $this->expressions = $expressions;
    }

    public function exprs()
    {
      return $this->expressions;
    }

  }
