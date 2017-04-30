<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/validate-exception.php';

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
    $uniqueCache = [];

    foreach ($source as $ind => $value) {
      try {
        $row = self::value($params, $value, array_merge($index, [$ind]), $uniqueCache);
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

  public static function value($params, $source = false, $index = [], & $uniqueCache = []) {
    $isTypeArray = isset($params['type']) && $params['type'] === 'array';

    if (!isset($params['collection']) && gettype($source) === 'array' && !$isTypeArray) {
      $data = [];

      foreach ($params as $field => $param) {
        $value = false;

        if (isset($source[$field])) {
          $value = $source[$field];
        }

        $data[$field] = self::value($param, $value, array_merge($index, [$field]), $uniqueCache);
      }
    } elseif (isset($params['collection'])) {
      $data = self::collection($params['collection'], $source, $index);

      if (isset($params['minlength'])) {
        if (count($data) < $params['minlength']) {
          return self::returnError('EMINLENGTH', $index, $data);
        }
      }

      if (isset($params['maxlength'])) {
        if (count($data) > $params['maxlength']) {
          return self::returnError('EMAXLENGTH', $index, $data);
        }
      }
    } else {
      $data = $source;

      if (array_key_exists('default', $params) && empty($data)) {
        $data = $params['default'];
      }

      if (isset($params['skipempty'])) {
        if (empty($data)) {
          throw new SkipEmptyException();
        }
      }

      if (isset($params['type']) && $params['type'] !== 'array') {
        $isBoolean = gettype($data) === 'boolean';
        $isMatch = preg_match(self::$regexpTypes[$params['type']], $data);

        if (!$isBoolean && !$isMatch) {
          return self::returnError('ENOTVALIDTYPE', $index, $data);
        }
      }

      if (isset($params['required']) && $params['required']) {
        if (empty($data)) {
          return self::returnError('EEMPTYREQUIRED', $index, $data);
        }
      }

      if (isset($params['valid'])) {
        if (gettype($params['valid']) === 'object' && is_callable($params['valid'])) {
          if (!$params['valid']($data)) {
            return self::returnError('ENOTVALIDVALUE', $index, $data);
          }
        } elseif (gettype($params['valid']) === 'string') {
          if (!preg_match($params['valid'], $data)) {
            return self::returnError('ENOTVALIDVALUE', $index, $data);
          }
        }
      }

      if (isset($params['values'])) {
        if (!in_array($data, $params['values'])) {
          return self::returnError('EVALUESNOTMATCHED', $index, $data);
        }
      }

      if (isset($params['unique'])) {
        if (gettype($params['unique']) === 'object' && is_callable($params['unique'])) {
          if (!$params['unique']($data)) {
            return self::returnError('ENOTUNIQUEVALUE', $index, $data);
          }
        } elseif (gettype($params['unique']) === 'boolean' && $params['unique']) {
          $cacheIndex = [];

          foreach ($index as $pos => $ind) {
            if (gettype($ind) !== 'integer' || $pos < count($index) - 2) {
              $cacheIndex[] = $ind;
            }
          }

          $cacheIndex = implode('.', $cacheIndex);

          if (!isset($uniqueCache[$cacheIndex])) {
            $uniqueCache[$cacheIndex] = [];
          }

          if (in_array($data, $uniqueCache[$cacheIndex])) {
            return self::returnError('ENOTUNIQUEVALUE', $index, $data);
          }

          $uniqueCache[$cacheIndex][] = $data;
        }
      }

      if (isset($params['modify'])) {
        if (gettype($params['modify']) === 'string') {
          $data = call_user_func($params['modify'], $data);
        } elseif (gettype($params['modify']) === 'object' && is_callable($params['modify'])) {
          $data = $params['modify']($data);
        }
      }
    }

    return $data;
  }

  private static function returnError($code, $index, $source) {
    throw new ValidateException(['code' => $code, 'index' => $index, 'source' => $source]);
  }
}
