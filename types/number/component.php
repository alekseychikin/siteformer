<?

  class SFTypeNumber extends SFType
  {
    public static function getSqlType($length = 10)
    {
      return 'INT('.$length.') NOT NULL';
    }
  }
