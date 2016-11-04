<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE . 'classes/validate.php';

  class SFTypeImage extends SFType
  {
    public static function validateSettings($params, $fields, $currentAlias) {
      $sources = self::getSources($fields, $params, $currentAlias);

      $params = parseJSON($params);
      $params = SFValidate::parse([
        [
          'name' => 'storage',
          'values' => array('local', 's3'),
          'require' => true,
          'error' => 'Неизвестный тип хранилища'
        ],
        [
          'name' => 'path'
        ],
        [
          'name' => 'width'
        ],
        [
          'name' => 'height'
        ],
        [
          'name' => 'saveRatio'
        ],
        [
          'name' => 'source',
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
          'require' => true,
          'error' => 'Неизвестный или зацикленный источник'
        ],
        [
          'name' => 's3AccessKey'
        ],
        [
          'name' => 's3SecretKey'
        ],
        [
          'name' => 's3Bucket'
        ],
        [
          'name' => 's3Path'
        ]
      ], $params);

      if ($params['source'] !== 'upload') {
        $params['hide'] = true;
      }

      return json_encode($params);
    }

    public static function detectSource($field) {
      if (isset($field['settings']) && isset($field['settings']['source']) && $field['settings']['source'] !== 'upload') {
        return $field['settings']['source'];
      }

      return false;
    }

    public static function prepareData($field, $data) {
      $settings = $field['settings'];

      if ($settings['source'] === 'upload') {
        $value = $data[$field['alias']];
      } else {
        $value = $data[$settings['source']];
      }

      if (!$value || $value === 'false') return false;

      $image = new SFImage(ENGINE_TEMP . $value);
      $resizeParams = [];

      if (isset($settings['width']) && $settings['width']) $resizeParams['width'] = $settings['width'];
      if (isset($settings['height']) && $settings['height']) $resizeParams['height'] = $settings['height'];
      if (isset($settings['maxsize']) && $settings['maxsize']) $resizeParams['maxsize'] = $settings['maxsize'];

      $fieldTempPath = $image->path('filepath') . $field['alias'] . '_' . $image->path('filename');
      $image = $image->resize($resizeParams, $fieldTempPath);

      if ($settings['storage'] === 's3') {
        SFPath::connectS3($settings['s3AccessKey'], $settings['s3SecretKey'], $settings['s3Bucket']);
        $path = SFPath::prepareDir($settings['s3Path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT) . date('Y/m/');

        return $bucketPath = SFPath::moveToBucket($path, $fieldTempPath);
      } elseif ($settings['storage'] === 'local') {
        $path = ROOT . SFPath::prepareDir($settings['path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

        return substr(SFPath::move($path . date('Y/m/'), $fieldTempPath), strlen($path));
      }

      return false;
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
