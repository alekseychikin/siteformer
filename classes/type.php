<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFType
  {
    public static function getSqlField($params)
    {
      return array(
        'type' => 'VARCHAR(250)',
        'null' => 'NULL',
        'default' => ''
      );
    }

    public static function validateSettings($params, $fields, $currentAlias)
    {
      return $params;
    }
  }
