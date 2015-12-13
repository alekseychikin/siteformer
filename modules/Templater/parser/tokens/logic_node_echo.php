<?php

  class LogicNodeEcho
  {
    private $expressions;
    private $modifiers = array();

    public function __construct($expressions, $modifiers = '')
    {
      $this->expressions = $expressions;
      if (gettype($modifiers) === 'array') {
        $this->modifiers = $modifiers;
      }
    }

    public function exprs()
    {
      return $this->expressions;
    }

    public function modifiers()
    {
      return $this->modifiers;
    }
  }
