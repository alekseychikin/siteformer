<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__.'/../../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validation_exception.php';

class ValidateTest extends PHPUnit_Framework_TestCase
{
  public function testValue() {
    try {
      $newValue = SFValidate::value([
        'type' => 'int',
        'required' => true
      ], 'string');

      var_dump($newValue);
    } catch (ValidationException $e) {
      print_r($e->getOriginMessage());
    }
  }
}
