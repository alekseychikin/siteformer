<?php

  class ReservedWord
  {
    private $word;

    public function __construct($word)
    {
      $this->word = trim($word);
    }

    public function get()
    {
      return $this->word;
    }
  }
