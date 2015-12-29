<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE . 'classes/validate.php';

  class SFTypeImage extends SFType
  {
    public static function validateSettings($params, $fields, $currentAlias)
    {
      $sources = self::getSources($fields, $params, $currentAlias);

      $params = json_decode($params, true);
      $params = SFValidate::parse(array(
        array(
          'name' => 'storage',
          'values' => array('local', 's3'),
          'require' => true,
          'error' => 'Неизвестный тип хранилища'
        ),
        array(
          'name' => 'path'
        ),
        array(
          'name' => 'width'
        ),
        array(
          'name' => 'height'
        ),
        array(
          'name' => 'source',
          'valid' => function ($value) use ($fields, $sources)
          {
            $usedSource = array($value);
            while (true) {
              // echo "value " . $value . "\n";
              if ($value === 'upload') return true;
              if (!in_array($value, $sources)) return false;
              $found = false;
              foreach ($fields as $field) {
                if ($field['alias'] === $value) {
                  $settings = json_decode($field['settings'], true);
                  // echo "source " . $settings['source'] . "\n";
                  if ($settings['source'] === 'upload') {
                    return true;
                  }
                  elseif (in_array($settings['source'], $usedSource)) {
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
            // print_r($fields);
            return true;
          },
          'require' => true,
          'error' => 'Неизвестный или зацикленный источник'
        ),
        array(
          'name' => 's3AccessKey'
        ),
        array(
          'name' => 's3SecretKey'
        ),
        array(
          'name' => 's3Bucket'
        ),
        array(
          'name' => 's3Path'
        )
      ), $params);
      if ($params['source'] !== 'upload') {
        $params['hide'] = true;
      }
      return json_encode($params);
    }

    private static function getSources($fields, $currentField, $currentAlias)
    {
      $sources = array('upload');
      foreach ($fields as $field) {
        if ($field['type'] == 'image' && $currentAlias != $field['alias']) {
          $sources[] = $field['alias'];
        }
      }
      return $sources;
    }
  }
