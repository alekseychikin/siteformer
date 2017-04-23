<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__.'/../../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validate-exception.php';

class ValidateCollectionTest extends PHPUnit_Framework_TestCase
{
  public function testEmptyCollection() {
    $collection = SFValidate::collection([
    ], [
    ]);

    $this->assertEquals($collection, []);
  }

  public function testNotEmptyCollection() {
    $collection = SFValidate::collection([
    ], [
      1, 2, 3, 4, 5
    ]);

    $this->assertEquals($collection, [1, 2, 3, 4, 5]);
  }

  public function testDefaultCollection() {
    $collection = SFValidate::collection([
      'default' => 4
    ], [
      1, 2, 3, false, 5
    ]);

    $this->assertEquals($collection, [1, 2, 3, 4, 5]);
  }

  public function testValidTypeNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'type' => 'int'
      ], [
        1, 2, 'a', 4, 5
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals([2], $message['index']);
    }
  }

  public function testValidTypePositiveCollection() {
    $collection = SFValidate::collection([
      'type' => 'int'
    ], [
      1, 2, 3, 4, 5
    ]);

    $this->assertEquals($collection, [1, 2, 3, 4, 5]);
  }

  public function testSkipempty() {
    $collection = SFValidate::collection([
      'skipempty' => true
    ], [
      1, 0, 3, 0, 5
    ]);

    $this->assertEquals($collection, [1, 3, 5]);
  }

  public function testValidCallbackNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'valid' => function ($value) {
          return $value < 4;
        }
      ], [
        1, 2, 3, 4, 5
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([3], $message['index']);
    }
  }

  public function testValidCallbackPositiveCollection() {
    $collection = SFValidate::collection([
      'valid' => function ($value) {
        return $value < 6;
      }
    ], [
      1, 2, 3, 4, 5
    ]);

    $this->assertEquals($collection, [1, 2, 3, 4, 5]);
  }

  public function testValidRegexpNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'valid' => '/^[0-9]+$/'
      ], [
        1, 2, 3, 4, 'a'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([4], $message['index']);
    }
  }

  public function testValidRegexpPositiveCollection() {
    $collection = SFValidate::collection([
      'valid' => '/^[0-9]+$/'
    ], [
      1, 2, 3, 4, 5
    ]);

    $this->assertEquals($collection, [1, 2, 3, 4, 5]);
  }

  public function testValuesNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'values' => ['a', 'b', 'c', 'd']
      ], [
        'a', 'b', 'a', 'd', 'e', 'd', 'c'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('EVALUESNOTMATCHED', $message['code']);
      $this->assertEquals([4], $message['index']);
    }
  }

  public function testValuesPositiveCollection() {
    $collection = SFValidate::collection([
      'values' => ['a', 'b', 'c', 'd', 'e']
    ], [
      'a', 'b', 'a', 'd', 'e', 'd', 'c'
    ]);

    $this->assertEquals($collection, ['a', 'b', 'a', 'd', 'e', 'd', 'c']);
  }

  public function testUniqueBooleanNegative() {
    try {
      $collection = SFValidate::collection([
        'unique' => true
      ], [
        'a', 'b', 'a', 'd', 'e', 'd', 'c'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([2], $message['index']);
    }
  }

  public function testUniqueBooleanPositive() {
    $collection = SFValidate::collection([
      'unique' => true
    ], [
      'a', 'b', 'd', 'e', 'c'
    ]);

    $this->assertEquals($collection, ['a', 'b', 'd', 'e', 'c']);
  }

  public function testUniqueCallbackNegative() {
    try {
      $collection = SFValidate::collection([
        'unique' => function ($value) {
          if ($value === 'd') {
            return false;
          }

          return true;
        }
      ], [
        'a', 'b', 'a', 'd', 'e', 'd', 'c'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([3], $message['index']);
    }
  }

  public function testUniqueCallbackPositive() {
    $collection = SFValidate::collection([
      'unique' => function ($value) {
        if ($value === 'f') {
          return false;
        }

        return true;
      }
    ], [
      'a', 'b', 'a', 'd', 'e', 'd', 'c'
    ]);

    $this->assertEquals($collection, ['a', 'b', 'a', 'd', 'e', 'd', 'c']);
  }

  public function testModifyCollection() {
    $collection = SFValidate::collection([
      'modify' => function ($value) {
        return $value * 2;
      }
    ], [
      1, 2, 3, 4, 5
    ]);

    $this->assertEquals($collection, [2, 4, 6, 8, 10]);
  }

  public function testMinlengthNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'collection' => [],
        'minlength' => 3
      ], [
        'a', 'b'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('EMINLENGTH', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testMinlengthPositiveCollection() {
    $collection = SFValidate::value([
      'collection' => [],
      'minlength' => 3
    ], [
      'a', 'b', 'c'
    ]);

    $this->assertEquals($collection, ['a', 'b', 'c']);
  }

  public function testMaxlengthNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'collection' => [],
        'maxlength' => 1
      ], [
        'a', 'b'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('EMAXLENGTH', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testMaxlengthPositiveCollection() {
    $collection = SFValidate::value([
      'collection' => [],
      'maxlength' => 6
    ], [
      'a', 'b', 'c'
    ]);

    $this->assertEquals($collection, ['a', 'b', 'c']);
  }
}
