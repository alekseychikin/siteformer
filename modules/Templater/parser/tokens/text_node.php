<?php

  class TextNode
  {
    private $text;

    public function __construct($node)
    {
      $this->text = $node;
    }

    public function text()
    {
      return $this->text;
    }
  }
