<?

  class SFTypeNumber extends SFGUIType
  {
    public static function getSqlType($length = 10)
    {
      return 'INT('.$length.') NOT NULL';
    }
  }
