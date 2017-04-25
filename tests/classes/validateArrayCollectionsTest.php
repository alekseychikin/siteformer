<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__.'/../../');
}

require_once ROOT . 'classes/validate.php';
require_once ROOT . 'classes/validate-exception.php';

class ValidateArrayCollectionsTest extends PHPUnit_Framework_TestCase
{
  public function testFieldWithField() {
    $collection = SFValidate::value(
      [
        'author' => [],
        'child' => [
          'name' => []
        ]
      ],
      [
        'author' => 'Alise',
        'child' => [
          'name' => 'Alex'
        ]
      ]
    );

    $this->assertEquals($collection, [
      'author' => 'Alise',
      'child' => [
        'name' => 'Alex'
      ]
    ]);
  }

  public function testFieldWithCollection() {
    $collection = SFValidate::value(
      [
        'author' => [],
        'childred' => [
          'collection' => []
        ]
      ],
      [
        'author' => 'Alise',
        'childred' => [
          'Alex',
          'Bob',
          'Christy'
        ]
      ]
    );

    $this->assertEquals($collection, [
      'author' => 'Alise',
      'childred' => [
        'Alex',
        'Bob',
        'Christy'
      ]
    ]);
  }

  public function testCollectionWithFields() {
    $collection = SFValidate::value([
      'collection' => [
        'author' => [],
        'child' => [
          'name' => []
        ]
      ]
    ],
    [
      [
        'author' => 'Alise',
        'child' => [
          'name' => 'Alex'
        ]
      ],
      [
        'author' => 'Alise',
        'child' => [
          'name' => 'Alex'
        ]
      ]
    ]);

    $this->assertEquals($collection, [
      [
        'author' => 'Alise',
        'child' => [
          'name' => 'Alex'
        ]
      ],
      [
        'author' => 'Alise',
        'child' => [
          'name' => 'Alex'
        ]
      ]
    ]);
  }

  public function testCollectionWithSimpleCollections() {
    $collection = SFValidate::value([
      'collection' => [
        'author' => [],
        'children' => [
          'collection' => []
        ]
      ]
    ],
    [
      [
        'author' => 'Alise',
        'children' => [
          'Iren',
          'Sherlock',
          'John'
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          'Iren',
          'Sherlock',
          'John'
        ]
      ]
    ]);

    $this->assertEquals($collection, [
      [
        'author' => 'Alise',
        'children' => [
          'Iren',
          'Sherlock',
          'John'
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          'Iren',
          'Sherlock',
          'John'
        ]
      ]
    ]);
  }

  public function testCollectionWithCollections() {
    $collection = SFValidate::value([
      'collection' => [
        'author' => [],
        'children' => [
          'collection' => [
            'name' => [],
            'age' => [
              'type' => 'int'
            ]
          ]
        ]
      ]
    ],
    [
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ]
    ]);

    $this->assertEquals($collection, [
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ]
    ]);
  }

  public function testCollectionWithCollectionsTypeNegative() {
    try {
      $collection = SFValidate::value([
        'collection' => [
          'author' => [],
          'children' => [
            'collection' => [
              'name' => [],
              'age' => [
                'type' => 'int'
              ]
            ]
          ]
        ]
      ],
      [
        [
          'author' => 'Alise',
          'children' => [
            ['name' => 'Iren', 'age' => 20],
            ['name' => 'Sherlock', 'age' => 21],
            ['name' => 'John', 'age' => 22]
          ]
        ],
        [
          'author' => 'Alise',
          'children' => [
            ['name' => 'Iren', 'age' => 20],
            ['name' => 'Sherlock', 'age' => 'twenty one'],
            ['name' => 'John', 'age' => 22]
          ]
        ]
      ]);

      $this->assertEquals(true, 'Never happend');
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();

      $this->assertEquals('ENOTVALIDTYPE', $message['code']);
      $this->assertEquals([1, 'children', 1, 'age'], $message['index']);
    }
  }

  public function testCollectionWithCollectionsTypePositive() {
    $collection = SFValidate::value([
      'collection' => [
        'author' => [],
        'children' => [
          'collection' => [
            'name' => [],
            'age' => [
              'type' => 'int'
            ]
          ]
        ]
      ]
    ],
    [
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ]
    ]);

    $this->assertEquals($collection, [
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ],
      [
        'author' => 'Alise',
        'children' => [
          ['name' => 'Iren', 'age' => 20],
          ['name' => 'Sherlock', 'age' => 21],
          ['name' => 'John', 'age' => 22]
        ]
      ]
    ]);
  }
}
