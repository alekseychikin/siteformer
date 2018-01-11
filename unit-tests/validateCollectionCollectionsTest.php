<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__ . '/../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validate-exception.php';

class ValidateCollectionCollectionsTest extends PHPUnit_Framework_TestCase
{
  public function testEmptyCollection() {
    $collection = SFValidate::collection([
    ], [
    ]);

    $this->assertEquals($collection, []);
  }

  public function testNotEmptyCollection() {
    $collection = SFValidate::collection([
      'name' => []
    ], [
      ['name' => 'Ross'],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross'],
      ['name' => 'Rachel']
    ]);
  }

  public function testDefaultCollection() {
    $collection = SFValidate::collection([
      'name' => [],
      'age' => [
        'default' => 30
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30]
    ]);
  }

  public function testSkipEmptyCollection() {
    $collection = SFValidate::collection([
      'name' => [],
      'age' => [
        'skipempty' => true
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29]
    ]);
  }

  public function testTypeNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [],
        'age' => [
          'type' => 'int'
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['name' => 'Rachel', 'age' => 'thirty']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals([1, 'age'], $message['index']);
    }
  }

  public function testTypePositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [],
      'age' => [
        'type' => 'int'
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => '30']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30]
    ]);
  }

  public function testRequiredNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [
          'required' => true
        ],
        'age' => []
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([1, 'name'], $message['index']);
    }
  }

  public function testRequiredPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [
        'required' => true
      ],
      'age' => []
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValidRegexpNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [],
        'age' => [
          'valid' => '/^[0-9]+$/'
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => 'thirty', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([1, 'age'], $message['index']);
    }
  }

  public function testValidRegexpPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [],
      'age' => [
        'valid' => '/^[0-9]+$/'
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValidCallbackNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [],
        'age' => [
          'valid' => function ($value) {
            return $value > 30;
          }
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([0, 'age'], $message['index']);
    }
  }

  public function testValidCallbackPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [],
      'age' => [
        'valid' => function ($value) {
          return $value > 28;
        }
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValuesNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [
          'values' => ['Ross', 'Rachel', 'Chandler']
        ],
        'age' => []
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EVALUESNOTMATCHED', $message['code']);
      $this->assertEquals([2, 'name'], $message['index']);
    }
  }

  public function testValuesPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [
        'values' => ['Ross', 'Rachel', 'Chandler', 'Phiby']
      ],
      'age' => []
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testUniqueCallbackNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [
          'unique' => function ($value) {
            if ($value === 'Phiby') {
              return false;
            }

            return true;
          }
        ],
        'age' => []
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (Exception $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([2, 'name'], $message['index']);
    }
  }

  public function testUniqueCallbackPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [
        'unique' => function ($value) {
          return true;
        }
      ],
      'age' => []
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testUniqueBooleanNegativeCollection() {
    try {
      $collection = SFValidate::collection([
        'name' => [
          'unique' => true
        ],
        'age' => []
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32'],
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (Exception $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([3, 'name'], $message['index']);
    }
  }

  public function testUniqueBooleanPositiveCollection() {
    $collection = SFValidate::collection([
      'name' => [
        'unique' => true
      ],
      'age' => []
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testModifyCollection() {
    $collection = SFValidate::collection([
      'name' => [
        'modify' => function ($value) {
          return strtoupper($value);
        }
      ],
      'age' => []
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'ROSS', 'age' => 29],
      ['age' => '30', 'name' => 'RACHEL'],
      ['name' => 'PHIBY', 'age' => '31'],
      ['name' => 'CHANDLER', 'age' => '32']
    ]);
  }

  public function testEmptyValue() {
    $collection = SFValidate::value([
      'collection' => []
    ], [
    ]);

    $this->assertEquals($collection, []);
  }

  public function testNotEmptyValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => []
      ]
    ], [
      ['name' => 'Ross'],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross'],
      ['name' => 'Rachel']
    ]);
  }

  public function testDefaultValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => [
          'default' => 30
        ]
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30]
    ]);
  }

  public function testSkipEmptyValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => [
          'skipempty' => true
        ]
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29]
    ]);
  }

  public function testTypeNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [],
          'age' => [
            'type' => 'int'
          ]
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['name' => 'Rachel', 'age' => 'thirty']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals([1, 'age'], $message['index']);
    }
  }

  public function testTypePositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => [
          'type' => 'int'
        ]
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => '30']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30]
    ]);
  }

  public function testRequiredNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [
            'required' => true
          ],
          'age' => []
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EEMPTYREQUIRED', $message['code']);
      $this->assertEquals([1, 'name'], $message['index']);
    }
  }

  public function testRequiredPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [
          'required' => true
        ],
        'age' => []
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['name' => 'Rachel', 'age' => 30],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValidRegexpNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [],
          'age' => [
            'valid' => '/^[0-9]+$/'
          ]
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => 'thirty', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([1, 'age'], $message['index']);
    }
  }

  public function testValidRegexpPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => [
          'valid' => '/^[0-9]+$/'
        ]
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValidCallbackNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [],
          'age' => [
            'valid' => function ($value) {
              return $value > 30;
            }
          ]
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTVALIDVALUE', $message['code']);
      $this->assertEquals([0, 'age'], $message['index']);
    }
  }

  public function testValidCallbackPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => [
          'valid' => function ($value) {
            return $value > 28;
          }
        ]
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testValuesNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [
            'values' => ['Ross', 'Rachel', 'Chandler']
          ],
          'age' => []
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EVALUESNOTMATCHED', $message['code']);
      $this->assertEquals([2, 'name'], $message['index']);
    }
  }

  public function testValuesPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [
          'values' => ['Ross', 'Rachel', 'Chandler', 'Phiby']
        ],
        'age' => []
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testUniqueCallbackNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [
            'unique' => function ($value) {
              if ($value === 'Phiby') {
                return false;
              }

              return true;
            }
          ],
          'age' => []
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (Exception $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([2, 'name'], $message['index']);
    }
  }

  public function testUniqueCallbackPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [
          'unique' => function ($value) {
            return true;
          }
        ],
        'age' => []
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testUniqueBooleanNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [
            'unique' => true
          ],
          'age' => []
        ]
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Chandler', 'age' => '32'],
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (Exception $e) {
      $message = $e->getDetails();

      $this->assertEquals('ENOTUNIQUEVALUE', $message['code']);
      $this->assertEquals([3, 'name'], $message['index']);
    }
  }

  public function testUniqueBooleanPositiveValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [
          'unique' => true
        ],
        'age' => []
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testModifyValue() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [
          'modify' => function ($value) {
            return strtoupper($value);
          }
        ],
        'age' => []
      ]
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'ROSS', 'age' => 29],
      ['age' => '30', 'name' => 'RACHEL'],
      ['name' => 'PHIBY', 'age' => '31'],
      ['name' => 'CHANDLER', 'age' => '32']
    ]);
  }

  public function testMinlengthNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [],
          'age' => []
        ],
        'minlength' => 5
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EMINLENGTH', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testMinlengthPositiveCollection() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => []
      ],
      'minlength' => 4
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }

  public function testMaxlengthNegativeValue() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'name' => [],
          'age' => []
        ],
        'maxlength' => 3
      ], [
        ['name' => 'Ross', 'age' => 29],
        ['age' => '30', 'name' => 'Rachel'],
        ['name' => 'Phiby', 'age' => '31'],
        ['name' => 'Chandler', 'age' => '32']
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getDetails();

      $this->assertEquals('EMAXLENGTH', $message['code']);
      $this->assertEquals([], $message['index']);
    }
  }

  public function testMaxlengthPositiveCollection() {
    $collection = SFValidate::value([
      'collection' => [
        'name' => [],
        'age' => []
      ],
      'maxlength' => 4
    ], [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);

    $this->assertEquals($collection, [
      ['name' => 'Ross', 'age' => 29],
      ['age' => '30', 'name' => 'Rachel'],
      ['name' => 'Phiby', 'age' => '31'],
      ['name' => 'Chandler', 'age' => '32']
    ]);
  }
}
