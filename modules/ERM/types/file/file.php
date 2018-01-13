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
}
