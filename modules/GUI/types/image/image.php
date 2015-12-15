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
          'values' => $sources,
          'require' => true,
          'error' => 'Неизвестный источник'
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
