<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../GUIType.php';

class SFTypeFile extends SFGUIType
{
  public static function validateSettings($params, $fields, $currentAlias)
  {
    return SFValidate::value([
      'storage' => [
        'values' => ['local', 's3']
      ],
      'path' => [],
      's3AccessKey' => [],
      's3SecretKey' => [],
      's3Bucket' => [],
      's3Path' => []
    ], $params);
  }
}
