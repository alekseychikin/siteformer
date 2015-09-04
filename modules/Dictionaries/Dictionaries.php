<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFDictionaries
  {
    public static function init($params)
    {
      if (!file_exists($params['dictionaries'])) die('Can\'t read dictionaries file: '.$params['dictionaries']);
      $dictionaries = include $params['dictionaries'];
      list($null, $dict) = each($dictionaries);
      foreach ($dict as $var => $val) {
        SFResponse::set($var, $val);
      }
      if (isset($dictionaries[SFRouter::language()])) {
        $dictionaries_ = $dictionaries[SFRouter::language()];
        foreach ($dictionaries_ as $var => $val) {
          SFResponse::set($var, $val);
        }
      }
      $defaultDict = $dictionaries[SFRouter::defaultLanguage()];
      foreach ($defaultDict  as $field => $value) {
        if (!isset($dictionaries_[$field])) {
          $dictionaries_[$field] = $defaultDict[$field];
        }
      }
      $dicts = '<script type="text/javascript">'.N;
      foreach ($dictionaries_ as $field => $value) {
        $dicts .= 'var '.$field.' = "'.htmlspecialchars($value).'";'.N;
      }
      $dicts .= '</script>';
      SFResponse::set('dictionaries', $dicts);
      // print_r(SFRouter::language());
    }
  }

?>
