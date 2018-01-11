<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__ . '/../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validate-exception.php';

class ValidateSimpleTest extends PHPUnit_Framework_TestCase
{
  public function testType() {
    try {
      $newValue = SFValidate::value([
        'type' => 'int'
      ], 'string');

      $this->assertEquals(false, $newValue);
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals([], $message['index']);
    }

    $newValue = SFValidate::value([
      'type' => 'int'
    ], '123');

    $this->assertEquals(123, $newValue);

    $newValue = SFValidate::value([
      'type' => 'bool'
    ], true);

    $this->assertEquals(true, $newValue);

    $newValue = SFValidate::value([
      'type' => 'bool'
    ], false);

    $this->assertEquals(false, $newValue);
  }

  public function testDefault() {
    $newValue = SFValidate::value([
      'default' => 'string'
    ], '');

    $this->assertEquals('string', $newValue);

    $newValue = SFValidate::value([
      'default' => 'string'
    ], '0');

    $this->assertEquals('string', $newValue);

    $newValue = SFValidate::value([
      'default' => 'string'
    ], 0);

    $this->assertEquals('string', $newValue);

    $newValue = SFValidate::value([
      'default' => 'string'
    ], 'old value');

    $this->assertEquals('old value', $newValue);
  }

  public function testRequired1() {
    try {
      $newValue = SFValidate::value([
        'required' => true
      ], '');

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testRequired2() {
    try {
      $newValue = SFValidate::value([
        'required' => true
      ], '0');

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testRequired3() {
    try {
      $newValue = SFValidate::value([
        'required' => true
      ], 0);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testRequired4() {
    try {
      $newValue = SFValidate::value([
        'required' => true
      ], false);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testRequired5() {
    $newValue = SFValidate::value([
      'required' => true
    ], 'string');

    $this->assertEquals('string', $newValue);
  }

  public function testValidRegexpNegative() {
    try {
      $newValue = SFValidate::value([
        'valid' => '/[a-z]/'
      ], '1');

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals([], $message['index']);
      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
    }
  }

  public function testValidCallbackNegative() {
    try {
      $newValue = SFValidate::value([
        'valid' => function ($value) {
          return false;
        }
      ], '1');

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals([], $message['index']);
      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
    }
  }

  public function testValidRegexpPositive() {
    $newValue = SFValidate::value([
      'valid' => '/[0-9]/'
    ], '1');

    $this->assertEquals(1, $newValue);
  }

  public function testValidCallbackPositive() {
    $newValue = SFValidate::value([
      'valid' => function ($value) {
        return true;
      }
    ], '1');

    $this->assertEquals(1, $newValue);
  }

  public function testValuesNegative() {
    try {
      $newValue = SFValidate::value([
        'values' => [0, 1, 2, 3, 4]
      ], 5);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals([], $message['index']);
      $this->assertEquals('EVALUESNOTMATCHED', $message['code']);
    }
  }

  public function testValuesPositive() {
    $newValue = SFValidate::value([
      'values' => [0, 1, 2, 3, 4]
    ], 4);

    $this->assertEquals(4, $newValue);
  }

  public function testUniqueCallbackNegative() {
    try {
      $newValue = SFValidate::value([
        'unique' => function ($value) {
          return false;
        }
      ], 5);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals([], $message['index']);
      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
    }
  }

  public function testUniqueCallbackPositive() {
    $newValue = SFValidate::value([
      'unique' => function ($value) {
        return true;
      }
    ], 5);

    $this->assertEquals(5, $newValue);
  }

  public function testModify() {
    $newValue = SFValidate::value([
      'modify' => function ($value) {
        return $value * 2;
      }
    ], 5);

    $this->assertEquals(10, $newValue);
  }
}
