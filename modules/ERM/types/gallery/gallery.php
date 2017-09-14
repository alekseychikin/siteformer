<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeGallery extends SFERMType
{
  public static function getSqlField($params)
  {
    return array(
      'type' => 'INT(11) UNSIGNED',
      'default' => null
    );
  }

  public static function validateSettings($params, $fields, $currentAlias)
  {
    return SFValidate::value([
      'storage' => [
        'values' => ['local', 's3']
      ],
      'path' => [],
      'width' => [],
      'height' => [],
      'previewWidth' => [],
      'previewHeight' => [],
      's3AccessKey' => [],
      's3SecretKey' => [],
      's3Bucket' => [],
      's3Path' => []
    ], $params);
  }
}
