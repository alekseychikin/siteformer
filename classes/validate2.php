<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SkipEmptyException extends Exception {}

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

  public static function collection($params, $source, $index = []) {
    $data = [];

    foreach ($source as $ind => $value) {
      try {
        $row = self::value($params, $value, array_merge($index, [$ind]));
        $data[$ind] = $row;
      } catch (SkipEmptyException $e) {
        $data[$ind] = null;
      }
    }

    $data = array_filter($data, function ($item) {
      return $item !== null;
    });

    $result = [];
    foreach ($data as $item) {
      $result[] = $item;
    }

    return $result;
  }

  public static function value($params, $source, $index = []) {
    if (!isset($params['collection']) && gettype($source) === 'array') {
      $data = [];

      foreach ($params as $field => $param) {
        $value = '';

        if (isset($source[$field])) {
          $value = $source[$field];
        }

        $data[$field] = self::value($param, $value, array_merge($index, [$field]));
      }
    } elseif (isset($params['collection'])) {
      $data = self::collection($params['collection'], $source, $index);

      if (isset($params['minlength'])) {
        if (count($data) < $params['minlength']) {
          return self::returnError('EMINLENGTH', $index, $data);
        }
      }

      if (isset($params['maxlength'])) {
        if (count($data) < $params['maxlength']) {
          return self::returnError('EMAXLENGTH', $index, $data);
        }
      }
    } else {
      $data = $source;

      if (isset($params['default']) && empty($data)) {
        $data = $params['default'];
      }

      if (isset($params['type'])) {
        $isBoolean = gettype($data) === 'boolean';
        $isMatch = preg_match(self::$regexpTypes[$params['type']], $data);

        if (!$isBoolean && !$isMatch) {
          return self::returnError('ENOTVALIDTYPE', $index, $data);
        }
      }

      if (isset($params['values'])) {
        if (!in_array($data, $params['values'])) {
          return self::returnError('EVALUESNOTMATCHED', $index, $data);
        }
      }

      if (isset($params['required'])) {
        if (empty($data)) {
          return self::returnError('EEMPTYREQUIRED', $index, $data);
        }
      }

      if (isset($params['modify'])) {
        if (gettype($params['modify']) === 'string') {
          $data = call_user_func($params['modify'], $data);
        } elseif (gettype($params['modify']) === 'object') {
          $data = $params['modify']($data);
        }
      }

      if (isset($params['skipempty'])) {
        if (empty($data)) {
          throw new SkipEmptyException();
        }
      }
    }

    return $data;
  }

  private static function returnError($type, $index, $source) {
    echo 'Error ' . $type . ($index !== false ? ': ' . print_r($index, true) : '');
  }
}
