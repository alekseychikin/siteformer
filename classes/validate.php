<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFValidate
  {
    private static $regexpTypes = array(
      'uint' => '/^(([1-9]\d*)|0)$/',
      'uzint' => '/^([1-9]\d*)$/',
      'int' => '/^((\-?[1-9]\d*)|0)$/',
      'email' => '/^[a-zA-Z_\-0-9\.]+@[a-zA-Z_\-0-9]+(\.[a-zA-Z]+)+$/',
      'float' => '/^(([1-9]\d*)|0)(\.\d+)?$/',
      'bool' => '/^(true|false)$/'
    );

    private static function returnError($field, $source = '')
    {
      SFResponse::error(422, array('error' => (isset($field['error']) ? str_replace(':value', $source, $field['error']) : 'Error at field `'.$field['name'].'`')));
    }

    public static function parse($fields, $source)
    {
      $data = array();
      foreach ($fields as $field) {
        if (isset($field['require']) && !!$field['require']) { // require
          if (!isset($source[$field['name']]) || (gettype($source[$field['name']]) === 'string' && strlen($source[$field['name']]) === 0)) {
            self::returnError($field);
          }
        }
        if (isset($field['values']) && isset($source[$field['name']])) {
          if (!in_array($source[$field['name']], $field['values'])) {
            self::returnError($field, $source[$field['name']]);
          }
        }
        if (isset($field['type']) && isset($source[$field['name']])) {
          if (!preg_match(self::$regexpTypes[$field['type']], $source[$field['name']])) {
            self::returnError($field, $source[$field['name']]);
          }
        }
        if (isset($field['valid']) && isset($source[$field['name']]) && strlen($source[$field['name']]) > 0) {
          if (!preg_match($field['valid'], $source[$field['name']])) {
            self::returnError($field, $source[$field['name']]);
          }
        }
        if (isset($field['default']) && !isset($source[$field['name']])) {
          $data[$field['name']] = $field['default'];
        }
        elseif (isset($source[$field['name']])) {
          $data[$field['name']] = $source[$field['name']];
        }
        else {
          $data[$field['name']] = '';
        }
        if (isset($field['modify'])) {
          if (gettype($field['modify']) == 'string') {
            $data[$field['name']] = call_user_func($field['modify'], $data[$field['name']]);
          }
          elseif (gettype($field['modify']) == 'object') {
            $data[$field['name']] = $field['modify']($data[$field['name']]);
          }
        }
      }
      return $data;
    }
    //SFResponse::error(422, array('error' => 'Не заполнено название'));

    public static function value($value, $params)
    {
      if (isset($params['require']) && !!$params['require']) { // require
        if (gettype($value) === 'string' && strlen($value) === 0) {
          SFResponse::error(422, array('error' => (isset($params['error']) ? $params['error'] : 'Error at field `'.$params['name'].'`')));
        }
      }
      if (isset($params['values'])) {
        if (!in_array($value, $params['values'])) {
          SFResponse::error(422, array('error' => (isset($params['error']) ? $params['error'] : 'Error at field `'.$params['name'].'`')));
        }
      }
      if (isset($params['type'])) {
        if (!preg_match(self::$regexpTypes[$params['type']], $value)) {
          SFResponse::error(422, array('error' => (isset($params['error']) ? $params['error'] : 'Error at field `'.$params['name'].'`')));
        }
      }
      if (isset($params['valid'])) {
        if (!preg_match($params['valid'], $value)) {
          SFResponse::error(422, array('error' => (isset($params['error']) ? $params['error'] : 'Error at field `'.$params['name'].'`')));
        }
      }
      if (isset($params['default']) && (gettype($value) === 'string' && strlen($value) === 0)) {
        $value = $params['default'];
      }
      return $value;
    }

    public static function checkArray($value, $error = false)
    {
      if (!count($value)) {
        SFResponse::error(422, array('error' => ($error !== false ? $error : 'Error with value `'.$value.'`')));
      }
    }

    public static function check($expression, $error = false)
    {
      if (!!$expression !== true) {
        SFResponse::error(422, array('error' => ($error !== false ? $error : 'Error with value `'.$value.'`')));
      }
    }

  }

?>
