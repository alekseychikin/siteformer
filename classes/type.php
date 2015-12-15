<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFType
  {
    public static function getSqlField($params)
    {
      return 'VARCHAR(250) NOT NULL DEFAULT ""';
    }

    public static function validateSettings($params, $fields, $currentAlias)
    {
      return $params;
    }
  }
