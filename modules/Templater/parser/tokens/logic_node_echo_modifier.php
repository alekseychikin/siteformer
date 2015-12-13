<?php

  class LogicNodeEchoModifier
  {
    private $name;
    private $params;

    public function __construct($name, $params = array())
    {
      $this->name = $name;
      $this->params = $params;
    }

    public function name()
    {
      return $this->name;
    }

    public function params()
    {
      return $this->params;
    }
  }
