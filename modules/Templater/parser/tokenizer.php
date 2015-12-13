<?php

  class Tokenizer
  {
    private $lexers = array();
    private $out = array();

    public function __construct($lexers)
    {
      $out = explode("\n", $lexers);
      foreach ($out as $index => $line) {
        $line = explode('return', $line);
        if (count($line) < 2) {
          continue;
        }
        $this->lexers[] = array(
          'regular' => trim($line[0]),
          'token' => trim($line[1])
        );
      }
    }

    public function nextToken(& $line)
    {
      $line = ($line);
      if (!count($this->lexers)) return false;
      if (!strlen($line)) return false;
      foreach ($this->lexers as $lex) {
        if (preg_match('/^' . $lex['regular'] . '/', $line, $regs)) {
          $line = substr($line, strlen($regs[0]));
          return array('token' => $lex['token'], 'value' => $regs[0]);
        }
      }
    }
  }
