<?php

  class MathVarIndex
  {
    private $name;
    private $isCheck = false;

    public function __construct($name, $questionMark = false)
    {
      $this->name = $name;
      if ($questionMark !== false) {
        $this->isCheck = true;
      }
    }

    public function name()
    {
      return $this->name;
    }

    public function isCheck()
    {
      return $this->isCheck;
    }
  }

?>
