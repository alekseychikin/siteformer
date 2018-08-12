<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../../../../classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeFile extends SFERMType
{
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
      'ext' => []
    ], $settings, $indexes);
  }

  public static function prepareInsertData($collection, $field, $data) {
    $settings = $field['settings'];

    return SFStorages::put($settings['storage'], $value, $settings['path']);
  }

  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    if ($currentData[$field['alias']] === $data[$field['alias']]) {
      return $data[$field['alias']];
    }

    $settings = $field['settings'];

    SFStorages::delete($settings['storage'], $currentData[$field['alias']]);

    return SFStorages::put($settings['storage'], $value, $settings['path']);
  }
}
