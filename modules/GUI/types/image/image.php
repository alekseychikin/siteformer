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

      if ($params['storage'] === 's3') {
        S3::setExceptions(true);
        S3::$useSSL = true;
        $s3 = new S3($params['s3AccessKey'], $params['s3SecretKey']);
        $params['s3BucketLocation'] = '';
        try {
          $params['s3BucketLocation'] = $s3->getBucketLocation($params['s3Bucket']);
        } catch (Exception $e) {}
      }

      return json_encode($params);
    }

    public static function detectSource($field) {
      if (isset($field['settings']) && isset($field['settings']['source']) && $field['settings']['source'] !== 'upload') {
        return $field['settings']['source'];
      }

      return false;
    }

    public static function prepareInsertData($section, $field, $data) {
      $settings = $field['settings'];

      if ($settings['source'] === 'upload') {
        $value = $data[$field['alias']];
      } else {
        $value = $data[$settings['source']];
      }

      if (!$value || $value === 'false') return '';

      $image = new SFImage(ENGINE_TEMP . $value);

      $fieldTempPath = $image->path('filepath') . $field['alias'] . '_' . $image->path('filename');
      $image = $image->resize($settings, $fieldTempPath);

      if ($settings['storage'] === 's3') {
        SFPath::connectS3($settings['s3AccessKey'], $settings['s3SecretKey'], $settings['s3Bucket']);
        $path = SFPath::prepareDir($settings['s3Path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT) . date('Y/m/');

        return $bucketPath = SFPath::moveToBucket($path, $fieldTempPath);
      } elseif ($settings['storage'] === 'local') {
        $path = ROOT . SFPath::prepareDir($settings['path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

        return substr(SFPath::move($path . date('Y/m/'), $fieldTempPath), strlen($path));
      }

      return '';
    }

    public static function prepareUpdateData($section, $field, $currentData, $data) {
      if ($currentData[$field['alias']] === $data[$field['alias']]) {
        return $data[$field['alias']];
      }

      $settings = $field['settings'];

      if ($settings['source'] === 'upload') {
        if (!empty($currentData[$field['alias']]) && file_exists(ROOT . $settings['path'] . $currentData[$field['alias']])) {
          unlink(ROOT . $settings['path'] . $currentData[$field['alias']]);
        }

        $value = $data[$field['alias']];
      } else {
        $value = $data[$settings['source']];
      }

      if (!$value || $value === 'false') return '';

      $image = new SFImage(ENGINE_TEMP . $value);

      $fieldTempPath = $image->path('filepath') . $field['alias'] . '_' . $image->path('filename');
      $image = $image->resize($settings, $fieldTempPath);

      if ($settings['storage'] === 's3') {
        SFPath::connectS3($settings['s3AccessKey'], $settings['s3SecretKey'], $settings['s3Bucket']);
        $path = SFPath::prepareDir($settings['s3Path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT) . date('Y/m/');

        return $bucketPath = SFPath::moveToBucket($path, $fieldTempPath);
      } elseif ($settings['storage'] === 'local') {
        $path = ROOT . SFPath::prepareDir($settings['path'], PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

        return substr(SFPath::move($path . date('Y/m/'), $fieldTempPath), strlen($path));
      }

      return $data[$field['alias']];
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
