<?php

  class Attribute
  {
    private $attribute;
    private $values = array();

    public function __construct($attribute, $values = array())
    {
      $this->attribute = $attribute;
      $this->values = $values;
    }

    public function name()
    {
      return $this->attribute;
    }

    public function values()
    {
      return $this->values;
    }
  }
