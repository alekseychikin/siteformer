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
        ->addKey('id', 'primary key')
        ->addKey(['section', 'field'])
        ->addKey(['section', 'field', 'title'])
        ->exec();
    }

    $exists = SFORM::exists('type_tags_records');

    if (!$exists) {
      SFORM::create('type_tags_records')
        ->addField([
          'name' => 'record',
          'type' => 'INT(11) UNSIGNED',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'tag',
          'type' => 'INT(11) UNSIGNED',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addKey(['record', 'tag'], 'primary key')
        ->exec();
    }
  }

  public static function getDefaultData($settings) {
    return '';
  }

  public static function prepareInsertData($section, $field, $data) {
    $tags = self::getArrTagsFromString($data[$field['alias']]);

    $existsTags = arrMap(self::getTagRecords($field['section'], $field['id'], $tags), function ($row) {
      return $row['tag'];
    });

    foreach ($tags as $index => $tag) {
      if (!in_array($tag, $existsTags)) {
        SFORM::insert('type_tags')
          ->values([
            'section' => $field['section'],
            'field' => $field['id'],
            'tag' => $tag
          ])
          ->exec();
      }
    }

    return implode(', ', $tags);
  }

  private static function getArrTagsFromString($tags) {
    return arrMap(explode(',', $tags), function ($tag) {
      return trim($tag);
    });
  }

  private static function getTagRecords($section, $field, $tags) {
    $result = SFORM::select()
      ->from('type_tags')
      ->where('section', $section)
      ->andWhere('field', $field)
      ->andOpenWhere();

    foreach ($tags as $index => $tag) {
      if (!$index) {
        $result = $result->where('tag', $tag);
      } else {
        $result = $result->orWhere('tag', $tag);
      }
    }

    return $result->closeWhere()
      ->exec();
  }

  public static function postPrepareInsertData($section, $field, $record, $data) {
    $tags = self::getArrTagsFromString($data[$field['alias']]);

    $ids = arrMap(self::getTagRecords($field['section'], $field['id'], $tags), function ($row) {
      return $row['id'];
    });

    SFORM::delete('type_tags_records')->where('record', $record['id'])->exec();

    foreach ($ids as $id) {
      SFORM::insert('type_tags_records')
        ->values([
          'record' => $record['id'],
          'tag' => $id
        ])
        ->exec();
    }
  }
}
