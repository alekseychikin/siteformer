<?php

  class Node
  {
    protected $textView = '';

    public function setText($value)
    {
      $this->textView = $value;
    }

    public function text()
    {
      return $this->textView;
    }
  }
