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

    public static function parse($fields, $source, & $uniqueCache = array(), $prevName = '', & $skip = false)
    {
      $data = array();
      foreach ($fields as $field) {
        if (isset($field['array'])) {
          $subdata = array();
          for ($i = 0; $i < count($source[$field['name']]); $i++) {
            $skip = false;
            list($key, $value) = each($field['array']);
            reset($field['array']);
            if (gettype($value) === 'array') {
              $row = self::parse($field['array'], $source[$field['name']][$i], $uniqueCache, $prevName . '.' . $field['name'], $skip);
            }
            else {
              $row = self::parse(array($field['array']), $source[$field['name']][$i], $uniqueCache, $prevName . '.' . $field['name'], $skip);
            }
            if (!$skip) {
              $subdata[] = $row;
            }
          }
          if (isset($field['minlength'])) {
            if (count($subdata) < $field['minlength']) {
              self::returnError($field);
            }
          }
          $data[$field['name']] = $subdata;
        }
        else {
          $isIssetSource = true;
          $sourceItem = null;
          if (gettype($source) === 'array') {
            $cacheName = $prevName . '.' . $field['name'];
            $isIssetSource = isset($source[$field['name']]);
            if ($isIssetSource) {
              $sourceItem = $source[$field['name']];
            }
          }
          if (gettype($source) !== 'array') {
            $sourceItem = $source;
            $cacheName = $prevName;
          }
          $isEmptySourceString = (gettype($sourceItem) === 'string' && strlen($sourceItem) === 0);

          if (isset($field['skip_row_if_empty']) && $field['skip_row_if_empty']) {
            if (!$isIssetSource || empty($sourceItem)) {
              $skip = true;
              return false;
            }
          }
          if (isset($field['require']) && $field['require']) { // require
            if (!$isIssetSource || $isEmptySourceString) {
              self::returnError($field);
            }
          }
          if (isset($field['values']) && $isIssetSource) {
            if (!in_array($sourceItem, $field['values'])) {
              self::returnError($field, $sourceItem);
            }
          }
          if (isset($field['type']) && $isIssetSource) {
            if (!preg_match(self::$regexpTypes[$field['type']], $sourceItem)) {
              self::returnError($field, $sourceItem);
            }
          }
          if (isset($field['valid']) && $isIssetSource && !$isEmptySourceString) {
            if (gettype($field['valid']) === 'object') {
              if (!$field['valid']($sourceItem)) {
                self::returnError($field, $sourceItem);
              }
            }
            elseif (!preg_match($field['valid'], $sourceItem)) {
              self::returnError($field, $sourceItem);
            }
          }
          if (isset($field['unique'])) {
            if (gettype($field['unique']) === 'boolean' && $field['unique']) {
              if (!isset($uniqueCache[$cacheName])) {
                $uniqueCache[$cacheName] = array();
              }
              if (in_array($sourceItem, $uniqueCache[$cacheName])) {
                self::returnError($field, $sourceItem);
              }
            }
            elseif (gettype($field['unique']) === 'object') {
              if (!$field['unique']($sourceItem)) {
                self::returnError($field, $sourceItem);
              }
            }
          }
          if (isset($field['default']) && !$isIssetSource) {
            if (gettype($source) === 'array') {
              $data[$field['name']] = $field['default'];
            }
            else {
              $data = $field['default'];
            }
          }
          elseif ($isIssetSource) {
            if (gettype($source) === 'array') {
              $data[$field['name']] = $sourceItem;
            }
            else {
              $data = $sourceItem;
            }
          }
          else {
            if (gettype($source) === 'array') {
              $data[$field['name']] = '';
            }
            else {
              $data = '';
            }
          }
          if (isset($field['modify'])) {
            if (gettype($field['modify']) == 'string') {
              if (gettype($source) === 'array') {
                $data[$field['name']] = call_user_func($field['modify'], $data[$field['name']]);
              }
              else {
                $data = call_user_func($field['modify'], $data);
              }
            }
            elseif (gettype($field['modify']) == 'object') {
              if (gettype($source) === 'array') {
                $data[$field['name']] = $field['modify']($data[$field['name']]);
              }
              else {
                $data = $field['modify']($data);
              }
            }
          }
          if (gettype($source) === 'array') {
            $uniqueCache[$cacheName][] = $data[$field['name']];
          }
          else {
            $uniqueCache[$cacheName][] = $data;
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
