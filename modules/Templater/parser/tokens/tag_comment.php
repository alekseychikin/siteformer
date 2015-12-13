<?php

  class TagComment
  {
    private $text;

    public function __construct($text)
    {
      $this->text = $text;
    }

    public function text()
    {
      return $this->text;
    }
  }
