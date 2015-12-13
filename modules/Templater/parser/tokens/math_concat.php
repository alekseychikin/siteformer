<?php

  class MathConcat
  {
    private $elements = array();

    public function __construct($firstElement)
    {
      $this->elements[] = $firstElement;
    }

    public function addElement($element)
    {
      $this->elements[] = $element;
    }

    public function elements()
    {
      return $this->elements;
    }
  }

?>
