<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';
require_once __DIR__ . '/helper.php';

class SFTypeImage extends SFERMType
{
  public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
    $sources = self::getSources($fields, $settings, $currentAlias);

    $storage = $settings['storage'];

    $settings = SFValidate::value([
      'storage' => [
        'values' => SFStorages::getStorageList(),
        'required' => true
      ],
      'path' => [
        'valid' => function ($path) use ($storage) {
          if ($storage === 'local') {
            checkLocalPath($path);
          }

          return true;
        }
      ],
      'width' => [],
      'height' => [],
      'saveRatio' => [],
      'source' => [
        'valid' => function ($value) use ($fields, $sources) {
          $usedSource = array($value);
          while (true) {
            if ($value === 'upload') return true;
            if (!in_array($value, $sources)) return false;

            $found = false;

            foreach ($fields as $field) {
              if ($field['alias'] === $value) {
                $settings = json_decode($field['settings'], true);

                if ($settings['source'] === 'upload') {
                  return true;
                } elseif (in_array($settings['source'], $usedSource)) {
                  return false;
                }

                $usedSource[] = $value;
                $value = $settings['source'];
                $found = true;

                break;
              }
            }

            if (!$found) {
              return false;
            }
          }

          return true;
        },
        'default' => 'upload'
      ]
    ], $settings, $indexes);

    if ($settings['source'] !== 'upload') {
      $settings['hide'] = true;
    }

    return $settings;
  }

  public static function detectSource($field) {
    if (isset($field['settings']) && isset($field['settings']['source']) && $field['settings']['source'] !== 'upload') {
      return $field['settings']['source'];
    }

    return false;
  }

  public static function prepareInsertData($collection, $field, $data) {
    $settings = $field['settings'];

    if ($settings['source'] === 'upload') {
      $value = $data[$field['alias']];
    } else {
      $value = $data[$settings['source']];
    }

    if (!$value || $value === 'false') return '';

    SFImage::resize($value, $settings);

    return SFStorages::put($settings['storage'], $value, $settings['path']);
  }

  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    if ($currentData[$field['alias']] === $data[$field['alias']]) {
      return $data[$field['alias']];
    }

    $settings = $field['settings'];

    if ($settings['source'] === 'upload') {
      $value = $data[$field['alias']];
    } else {
      $value = $data[$settings['source']];
    }

    if (!$value || $value === 'false') return '';

    SFImage::resize($value, $settings);

    SFStorages::delete($settings['storage'], $currentData[$field['alias']]);

    return SFStorages::put($settings['storage'], $value, $settings['path']);
  }

  private static function getSources($fields, $currentField, $currentAlias) {
    $sources = array('upload');

    foreach ($fields as $field) {
      if ($field['type'] == 'image' && $currentAlias != $field['alias']) {
        $sources[] = $field['alias'];
      }
    }

    return $sources;
  }
}
