<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFORMCustomValue
{
  private $pattern;
  private $params;

  public function __construct($pattern, $params) {
    $this->pattern = $pattern;
    $this->params = $params;
  }

  public function value() {
    $result = $this->pattern;

    if (preg_match_all('/\:(\w+)/', $this->pattern, $matches)) {
      foreach ($matches[1] as $value) {
        $result = str_replace(':' . $value, $this->params[$value], $result);
      }
    }

    return $result;
  }

  public function get($field) {
    return $this->params[$field];
  }

  public function set($field, $value) {
    return $this->params[$field] = $value;
  }
}
