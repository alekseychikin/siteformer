<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__.'/../../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validate-exception.php';

class ValidateSimpleCollectionTest extends PHPUnit_Framework_TestCase
{
  public function testEmptyCollection() {
    $collection = SFValidate::value([
    ], [
      'name' => 'Elen'
    ]);

    $this->assertEquals($collection, []);
  }

  public function testOneFieldCollection() {
    $collection = SFValidate::value([
      'name' => []
    ], [
      'name' => 'Elen'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen']);
  }

  public function testCoupleFieldsCollection() {
    $collection = SFValidate::value([
      'name' => [],
      'age' => []
    ], [
      'name' => 'Elen',
      'age' => 20
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 20]);
  }

  public function testDefaultWorkCollection() {
    $collection = SFValidate::value([
      'name' => [],
      'age' => [
        'default' => 20
      ]
    ], [
      'name' => 'Elen'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 20]);
  }

  public function testDefaultIgnoreCollection() {
    $collection = SFValidate::value([
      'name' => [],
      'age' => [
        'default' => 20
      ]
    ], [
      'name' => 'Elen',
      'age' => 19
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 19]);
  }

  public function testValidTypeNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'name' => [],
        'age' => [
          'type' => 'int'
        ]
      ], [
        'name' => 'Elen',
        'age' => 'eleven'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals(['age'], $message['index']);
    }
  }

  public function testValidTypePositiveCollection() {
    $collection = SFValidate::value([
      'name' => [],
      'age' => [
        'type' => 'int'
      ]
    ], [
      'name' => 'Elen',
      'age' => '11'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 11]);
  }

  public function testRequiredNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'name' => [
          'required' => true
        ],
        'age' => []
      ], [
        'name' => '',
        'age' => 'eleven'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals(['name'], $message['index']);
    }
  }

  public function testRequiredPositiveCollection() {
    $collection = SFValidate::value([
      'name' => [
        'required' => true
      ],
      'age' => []
    ], [
      'name' => 'Elen',
      'age' => 'eleven'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 'eleven']);
  }

  public function testValidCallbackNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'name' => [
          'valid' => function ($value) {
            return false;
          }
        ],
        'age' => []
      ], [
        'name' => 'Elen',
        'age' => 'eleven'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals(['name'], $message['index']);
    }
  }

  public function testValidRegexpNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'name' => [
          'valid' => '/[0-9]+/'
        ],
        'age' => []
      ], [
        'name' => 'Elen',
        'age' => 'eleven'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals(['name'], $message['index']);
    }
  }

  public function testValidCallbackPositiveCollection() {
    $collection = SFValidate::value([
      'name' => [
        'valid' => function ($value) {
          return true;
        }
      ],
      'age' => []
    ], [
      'name' => 'Elen',
      'age' => 'eleven'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 'eleven']);
  }

  public function testValidRegexpPositiveCollection() {
    $collection = SFValidate::value([
      'name' => [],
      'age' => [
        'valid' => '/[0-9]+/'
      ]
    ], [
      'name' => 'Elen',
      'age' => '11'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => '11']);
  }

  public function testValuesNegativeCollection() {
    try {
      $collection = SFValidate::value([
        'name' => [
          'values' => ['Andy', 'Rendy', 'Mini', 'Wendy']
        ]
      ], [
        'name' => 'Elle'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('EVALUESNOTMATCHED', $message['code']);
      $this->assertEquals(['name'], $message['index']);
    }
  }

  public function testValuesPositiveCollection() {
    $collection = SFValidate::value([
      'name' => [
        'values' => ['Andy', 'Rendy', 'Mini', 'Wendy', 'Elle']
      ]
    ], [
      'name' => 'Elle'
    ]);

    $this->assertEquals($collection, ['name' => 'Elle']);
  }

  public function testUniqueCallbackNegative() {
    try {
      $collection = SFValidate::value([
        'name' => [
          'unique' => function ($value) {
            return false;
          }
        ],
        'age' => []
      ], [
        'name' => 'Elen',
        'age' => 'eleven'
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals(['name'], $message['index']);
    }
  }

  public function testUniqueCallbackPositive() {
    $collection = SFValidate::value([
      'name' => [
        'unique' => function ($value) {
          return true;
        }
      ],
      'age' => []
    ], [
      'name' => 'Elen',
      'age' => 'eleven'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen', 'age' => 'eleven']);
  }

  public function testModify() {
    $collection = SFValidate::value([
      'name' => [
        'modify' => function ($value) {
          return $value . '!';
        }
      ],
      'age' => []
    ], [
      'name' => 'Elen',
      'age' => 'eleven'
    ]);

    $this->assertEquals($collection, ['name' => 'Elen!', 'age' => 'eleven']);
  }
}
