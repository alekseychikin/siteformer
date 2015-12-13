<?php

  class MathVar
  {
    private $name;
    private $indexes = array();
    private $isCheck = false;

    public function __construct($name, $questionMark = false)
    {
      $this->name = $name;
      if ($questionMark !== false) {
        $this->isCheck = true;
      }
    }

    public function addIndex($index)
    {
      $this->indexes[] = $index;
    }

    public function name()
    {
      return $this->name;
    }

    public function indexes()
    {
      return $this->indexes;
    }

    public function isCheck()
    {
      return $this->isCheck;
    }
  }

?>
