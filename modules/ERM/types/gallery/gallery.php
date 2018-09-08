<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeGallery extends SFERMType
{
  public static function hasSqlField() {
    return false;
  }

  public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
    return SFValidate::value([
      'storage' => [
        'values' => SFStorages::getStorageList()
      ],
      'path' => [
        'valid' => function ($value) use ($settings, $indexes) {
          return SFStorages::checkWritablePath($settings['storage'], $value, array_merge($indexes, ['path']));
        }
      ],
      'width' => [],
      'height' => [],
      'previewWidth' => [],
      'previewHeight' => []
    ], $settings, $indexes);
  }

  public static function prepareDatabase() {
    if (!SFORM::exists('sys_type_gallery')) {
      SFORM::create('sys_type_gallery')
        ->addField([
          'name' => 'id',
          'type' => 'INT(11) UNSIGNED',
          'autoincrement' => true,
          'null' => false
        ])
        ->addField([
          'name' => 'collection',
          'type' => 'INT(11) UNSIGNED',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'field',
          'type' => 'VARCHAR(100)',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'record',
          'type' => 'INT(11) UNSIGNED',
          'null' => false
        ])
        ->addField([
          'name' => 'preview',
          'type' => 'VARCHAR(200)',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addField([
          'name' => 'image',
          'type' => 'VARCHAR(200)',
          'null' => 'NULL',
          'default' => NULL
        ])
        ->addKey(['collection', 'field'])
        ->addKey('id', 'primary key')
        ->exec();
    }
  }

  public static function postPrepareInsertData($collection, $field, $record, $data) {
    $images = $data[$field['alias']];
    $settings = $field['settings'];

    foreach ($images as $image) {
      $basename = basename($image);
      $dirname = dirname($image);
      $preview = pathresolve($dirname, 'preview_' . $basename);

      copy($image, $preview);

      SFImage::resize($preview, [
        'width' => $settings['previewWidth'],
        'height' => $settings['previewHeight']
      ]);
      SFImage::resize($image, $settings);

      $preview = SFStorages::put($settings['storage'], $preview, $settings['path']);
      $image = SFStorages::put($settings['storage'], $image, $settings['path']);

      SFORM::insert('sys_type_gallery')
        ->values([
          'collection' => $collection['id'],
          'field' => $field['alias'],
          'record' => $record['id'],
          'preview' => $preview,
          'image' => $image
        ])
        ->exec();
    }
  }

  public static function postPrepareUpdateData($collection, $field, $record, $data) {
    $actions = $data[$field['alias']];
    $settings = $field['settings'];

    foreach ($actions as $action) {
      switch ($action['action']) {
        case 'delete':
          $image = SFORM::select()
            ->from('sys_type_gallery')
            ->where('id', $action['id'])
            ->execOne();

          SFStorages::delete($settings['storage'], $image['preview']);
          SFStorages::delete($settings['storage'], $image['image']);

          SFORM::delete('sys_type_gallery')
            ->where('id', $image['id'])
            ->exec();
          break;
        case 'add':
          $image = $action['image'];
          $basename = basename($image);
          $dirname = dirname($image);
          $preview = pathresolve($dirname, 'preview_' . $basename);

          copy($image, $preview);

          SFImage::resize($preview, [
            'width' => $settings['previewWidth'],
            'height' => $settings['previewHeight']
          ]);
          SFImage::resize($image, $settings);

          $preview = SFStorages::put($settings['storage'], $preview, $settings['path']);
          $image = SFStorages::put($settings['storage'], $image, $settings['path']);

          println($record);

          SFORM::insert('sys_type_gallery')
            ->values([
              'collection' => $collection['id'],
              'field' => $field['alias'],
              'record' => $record['id'],
              'preview' => $preview,
              'image' => $image
            ])
            ->exec();
      }
    }
  }


  public static function joinData($databaseQuery, $collection, $field) {
    $databaseQuery->join('sys_type_gallery')
      ->on('sys_type_gallery.record', SFORM::field($collection['table'] . '.id'))
      ->andOn('sys_type_gallery.collection', $collection['id'])
      ->andOn('sys_type_gallery.field', $field['alias']);
  }

  public static function postProcessData($collection, $field, $data) {
    $data[$field['alias']] = [];

    foreach ($data['sys_type_gallery'] as $index => $item) {
      if ($item['field'] === $field['alias']) {
        unset($item['collection']);
        unset($item['field']);
        unset($item['record']);
        $data[$field['alias']][] = $item;
        unset($data['sys_type_gallery'][$index]);
      }
    }

    return $data;
  }
}
