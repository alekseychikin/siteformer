<?php

  class LogicNotEqual
  {
    private $leftPart;
    private $rightPart;

    public function __construct($leftPart, $rightPart)
    {
      $this->leftPart = $leftPart;
      $this->rightPart = $rightPart;
    }

    public function leftPart()
    {
      return $this->leftPart;
    }

    public function rightPart()
    {
      return $this->rightPart;
    }
  }

?>
