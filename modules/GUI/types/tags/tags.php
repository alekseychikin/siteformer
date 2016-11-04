<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeTags extends SFType
{
  public static function prepareDatabase() {
    $exists = SFORM::exists('type_tags');

    if (!$exists) {
      SFORM::create('type_tags')
        ->addField([
          'name' => 'id',
          'type' => 'INT(11) UNSIGNED',
          'autoincrement' => true,
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'section',
          'type' => 'INT(11) UNSIGNED',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'field',
          'type' => 'INT(11) UNSIGNED',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'tag',
          'type' => 'VARCHAR(200)'
        ])
        ->addField([
          'name' => 'index',
          'type' => 'VARCHAR(200)'
        ])
        ->addKey('id', 'primary key')
        ->addKey(['section', 'field'])
        ->addKey(['section', 'field', 'title'])
        ->exec();
    }
  }

  public static function getDefaultData($settings) {
    return '';
  }
}
