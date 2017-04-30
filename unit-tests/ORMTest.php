<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__ . '/../');
}

require_once ROOT . 'modules/ORM/ORM.php';
$configs = include __DIR__ . '/../../config/database.php';

SFORMDatabase::init($configs);
SFORM::drop('test_table_authors')->exec();
SFORM::drop('test_table_books')->exec();
SFORM::drop('test_table_tags')->exec();

class ORMTest extends PHPUnit_Framework_TestCase
{
  public function testExistingTables() {
    $this->assertEquals(false, SFORM::exists('test_table_authors'));
    $this->assertEquals(false, SFORM::exists('test_table_books'));
    $this->assertEquals(false, SFORM::exists('test_table_tags'));
  }

  public function testCreateTable() {
    SFORM::create('test_table_authors')
      ->addField([
        'name' => 'id',
        'type' => 'INT(10)',
        'autoincrement' => true
      ])
      ->addField([
        'name' => 'firstname',
        'type' => 'VARCHAR(200)',
        'default' => ''
      ])
      ->addField([
        'name' => 'lastname',
        'type' => 'VARCHAR(200)',
        'default' => ''
      ])
      ->addKey('id', 'PRIMARY KEY')
      ->exec();

    $this->assertEquals(true, SFORM::exists('test_table_authors'));
  }

  public function testAlterTableAddKey() {
    SFORM::alter('test_table_authors')
      ->addIndex('firstname')
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  PRIMARY KEY (`id`),
  KEY `firstname` (`firstname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableDropKey() {
    SFORM::alter('test_table_authors')
      ->dropIndex('firstname')
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableAddField() {
    SFORM::alter('test_table_authors')
      ->addField([
        'name' => 'born',
        'type' => 'DATE',
        'null' => true,
        'default' => NULL
      ])
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  `born` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableChangeField() {
    SFORM::alter('test_table_authors')
      ->changeField('born', [
        'name' => 'date_born',
        'type' => 'DATETIME',
        'null' => true,
        'default' => NULL
      ])
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  `date_born` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableDropField() {
    SFORM::alter('test_table_authors')
      ->dropField('date_born')
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableMixedCase1() {
    SFORM::alter('test_table_authors')
      ->addField([
        'name' => 'born',
        'type' => 'DATE',
        'null' => true,
        'default' => NULL
      ])
      ->addIndex('born')
      ->addField([
        'name' => 'dead',
        'type' => 'DATE',
        'null' => true,
        'default' => NULL
      ])
      ->addIndex('dead')
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  `born` date DEFAULT NULL,
  `dead` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `born` (`born`),
  KEY `dead` (`dead`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testAlterTableMixedCase2() {
    SFORM::alter('test_table_authors')
      ->dropIndex('born')
      ->dropIndex('dead')
      ->dropField('born')
      ->dropField('dead')
      ->exec();

    $createTable = SFORM::query('SHOW CREATE TABLE `test_table_authors`');
    $example = 'CREATE TABLE `test_table_authors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL DEFAULT \'\',
  `lastname` varchar(200) NOT NULL DEFAULT \'\',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

    $this->assertEquals($example, $createTable[0]['Create Table']);
  }

  public function testCreateAnotherCoupleTables() {
    SFORM::create('test_table_books')
      ->addField([
        'name' => 'id',
        'type' => 'int(10)',
        'autoincrement' => true
      ])
      ->addField([
        'name' => 'title',
        'type' => 'varchar(200)',
        'null' => true,
        'default' => null
      ])
      ->addField([
        'name' => 'id_author',
        'type' => 'int(10)',
        'null' => true,
        'default' => null
      ])
      ->addKey('id', 'PRIMARY KEY')
      ->addKey('title', 'UNIQUE')
      ->addKey('id_author', 'KEY')
      ->exec();

    $this->assertEquals(true, SFORM::exists('test_table_books'));

    SFORM::create('test_table_tags')
      ->addField([
        'name' => 'id_author',
        'type' => 'int(10)'
      ])
      ->addField([
        'name' => 'id_book',
        'type' => 'int(10)'
      ])
      ->addKey(['id_author', 'id_book'], 'PRIMARY KEY')
      ->exec();

    $this->assertEquals(true, SFORM::exists('test_table_tags'));

    $this->assertEquals(SFORM::getPrimaryFields('test_table_tags'), [
      'id_author',
      'id_book'
    ]);
  }

  public function testInsertData() {
    SFORM::insert('test_table_authors')
      ->values([
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ])
      ->exec();

    $this->assertEquals(SFORM::select()->from('test_table_authors')->exec(), [
      [
        'id' => 1,
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ]
    ]);

    SFORM::insert('test_table_authors')
      ->values([
        'firstname' => 'Aleksandr',
        'lastname' => 'Pushkin'
      ])
      ->exec();

    $this->assertEquals(SFORM::select()->from('test_table_authors')->exec(), [
      [
        'id' => 1,
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ],
      [
        'id' => 2,
        'firstname' => 'Aleksandr',
        'lastname' => 'Pushkin'
      ]
    ]);

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book1',
        'id_author' => 1
      ])
      ->exec();

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book2',
        'id_author' => 1
      ])
      ->exec();

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book3',
        'id_author' => 1
      ])
      ->exec();

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book4',
        'id_author' => 2
      ])
      ->exec();

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book5',
        'id_author' => 2
      ])
      ->exec();

    SFORM::insert('test_table_books')
      ->values([
        'title' => 'book6',
        'id_author' => 2
      ])
      ->exec();

    $this->assertEquals(6, count(SFORM::select()->from('test_table_books')->exec()));
  }

  public function testSelect1() {
    $result = SFORM::select('title')
      ->from('test_table_books')
      ->exec();

    $this->assertEquals(6, count($result));
    $this->assertEquals($result, [
      ['id' => 1, 'title' => 'book1'],
      ['id' => 2, 'title' => 'book2'],
      ['id' => 3, 'title' => 'book3'],
      ['id' => 4, 'title' => 'book4'],
      ['id' => 5, 'title' => 'book5'],
      ['id' => 6, 'title' => 'book6']
    ]);

    $result = SFORM::select()
      ->from('test_table_authors')
      ->join('test_table_books')
      ->on('test_table_books.id_author', SFORM::field('test_table_authors.id'))
      ->exec();

    $this->assertEquals($result, [
      [
        'id' => 1,
        'test_table_books' => [
          [
            'id' => 1,
            'title' => 'book1',
            'id_author' => 1
          ],
          [
            'id' => 2,
            'title' => 'book2',
            'id_author' => 1
          ],
          [
            'id' => 3,
            'title' => 'book3',
            'id_author' => 1
          ]
        ],
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ],
      [
        'id' => 2,
        'test_table_books' => [
          [
            'id' => 4,
            'title' => 'book4',
            'id_author' => 2
          ],
          [
            'id' => 5,
            'title' => 'book5',
            'id_author' => 2
          ],
          [
            'id' => 6,
            'title' => 'book6',
            'id_author' => 2
          ]
        ],
        'firstname' => 'Aleksandr',
        'lastname' => 'Pushkin'
      ]
    ]);

    $result = SFORM::select()
      ->from('test_table_authors', 'authors')
      ->join('test_table_books', 'books')
      ->on('books.id_author', SFORM::field('authors.id'))
      ->exec();

    $this->assertEquals($result, [
      [
        'id' => 1,
        'books' => [
          [
            'id' => 1,
            'title' => 'book1',
            'id_author' => 1
          ],
          [
            'id' => 2,
            'title' => 'book2',
            'id_author' => 1
          ],
          [
            'id' => 3,
            'title' => 'book3',
            'id_author' => 1
          ]
        ],
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ],
      [
        'id' => 2,
        'books' => [
          [
            'id' => 4,
            'title' => 'book4',
            'id_author' => 2
          ],
          [
            'id' => 5,
            'title' => 'book5',
            'id_author' => 2
          ],
          [
            'id' => 6,
            'title' => 'book6',
            'id_author' => 2
          ]
        ],
        'firstname' => 'Aleksandr',
        'lastname' => 'Pushkin'
      ]
    ]);
  }

  public static function testPrepareTablesToSelectManyToMany() {
    SFORM::alter('test_table_books')
      ->dropField('id_author')
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 1,
        'id_book' => 1
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 1,
        'id_book' => 2
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 1,
        'id_book' => 3
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 1,
        'id_book' => 4
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 2,
        'id_book' => 3
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 2,
        'id_book' => 4
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 2,
        'id_book' => 5
      ])
      ->exec();

    SFORM::insert('test_table_tags')
      ->values([
        'id_author' => 2,
        'id_book' => 6
      ])
      ->exec();
  }

  public function testSelect2() {
    $result = SFORM::select()
      ->from('test_table_authors')
      ->join('test_table_tags')
      ->on('test_table_tags.id_author', SFORM::field('test_table_authors.id'))
      ->join('test_table_books')
      ->on('test_table_books.id', SFORM::field('test_table_tags.id_book'))
      ->exec();

    $this->assertEquals($result, [
      [
        'id' => 1,
        'test_table_tags' => [
          ['id_author' => 1, 'id_book' => 1],
          ['id_author' => 1, 'id_book' => 2],
          ['id_author' => 1, 'id_book' => 3],
          ['id_author' => 1, 'id_book' => 4]
        ],
        'test_table_books' => [
          ['id' => 1, 'title' => 'book1'],
          ['id' => 2, 'title' => 'book2'],
          ['id' => 3, 'title' => 'book3'],
          ['id' => 4, 'title' => 'book4']
        ],
        'firstname' => 'Lev',
        'lastname' => 'Tolstoy'
      ],
      [
        'id' => 2,
        'test_table_tags' => [
          ['id_author' => 2, 'id_book' => 3],
          ['id_author' => 2, 'id_book' => 4],
          ['id_author' => 2, 'id_book' => 5],
          ['id_author' => 2, 'id_book' => 6]
        ],
        'test_table_books' => [
          ['id' => 3, 'title' => 'book3'],
          ['id' => 4, 'title' => 'book4'],
          ['id' => 5, 'title' => 'book5'],
          ['id' => 6, 'title' => 'book6']
        ],
        'firstname' => 'Aleksandr',
        'lastname' => 'Pushkin'
      ]
    ]);

    $result = SFORM::select()
      ->from('test_table_authors', 'authors')
      ->join('test_table_tags', 'tags')
      ->on('tags.id_author', SFORM::field('authors.id'))
      ->join('test_table_books', 'books')
      ->on('books.id', SFORM::field('tags.id_book'))
      ->exec();

      $this->assertEquals($result, [
        [
          'id' => 1,
          'tags' => [
            ['id_author' => 1, 'id_book' => 1],
            ['id_author' => 1, 'id_book' => 2],
            ['id_author' => 1, 'id_book' => 3],
            ['id_author' => 1, 'id_book' => 4]
          ],
          'books' => [
            ['id' => 1, 'title' => 'book1'],
            ['id' => 2, 'title' => 'book2'],
            ['id' => 3, 'title' => 'book3'],
            ['id' => 4, 'title' => 'book4']
          ],
          'firstname' => 'Lev',
          'lastname' => 'Tolstoy'
        ],
        [
          'id' => 2,
          'tags' => [
            ['id_author' => 2, 'id_book' => 3],
            ['id_author' => 2, 'id_book' => 4],
            ['id_author' => 2, 'id_book' => 5],
            ['id_author' => 2, 'id_book' => 6]
          ],
          'books' => [
            ['id' => 3, 'title' => 'book3'],
            ['id' => 4, 'title' => 'book4'],
            ['id' => 5, 'title' => 'book5'],
            ['id' => 6, 'title' => 'book6']
          ],
          'firstname' => 'Aleksandr',
          'lastname' => 'Pushkin'
        ]
      ]);
  }

  public function testWhereExpression() {
    $query = SFORM::select()
      ->from('test_table_authors', 'authors')
      ->where('authors.firstname', 'str1')
      ->orWhere('authors.firstname', '>', 'str2')
      ->andWhere('authors.firstname', '<', 'str3')
      ->andOpenWhere()
      ->where('authors.firstname', 'LIKE', '%str4%')
      ->orWhere('authors.firstname', 'FIND_IN_SET', SFORM::field('authors.lastname'))
      ->closeWhere()
      ->getQuery();

    $this->assertEquals($query, 'SELECT `authors`.`id` AS `authors.id`, `authors`.`firstname` AS `authors.firstname`, `authors`.`lastname` AS `authors.lastname`
FROM `test_table_authors` AS `authors`
WHERE `authors`.`firstname` = \'str1\' OR `authors`.`firstname` > \'str2\' AND `authors`.`firstname` < \'str3\' AND (`authors`.`firstname` LIKE \'%str4%\' OR FIND_IN_SET(`authors`.`firstname`, `authors`.`lastname`))');
  }
}
