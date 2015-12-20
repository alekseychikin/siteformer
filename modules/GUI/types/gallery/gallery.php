<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE . 'classes/validate.php';

  class SFTypeGallery extends SFType
  {
    public static function getSqlField($params)
    {
      return array(
        'type' => 'INT(11) UNSIGNED',
        'default' => NULL
      );
    }

    public static function validateSettings($params, $fields, $currentAlias)
    {
      $params = json_decode($params, true);
      $params = SFValidate::parse(array(
        array(
          'name' => 'storage',
          'values' => array('local', 's3'),
          'error' => 'Неизвестный источник'
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
          'name' => 'previewWidth'
        ),
        array(
          'name' => 'previewHeight'
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
  }
