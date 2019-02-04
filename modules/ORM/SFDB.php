<?php

require_once __DIR__ . '/ORMValue.php';

/**
 * @param $field
 * @param $table
 *
 * @return string
 */
function _field_($field, $table = '') {
  if (substr($field, 0, 1) == '`') {
    return $field;
  }

  if ($table) {
    return '`'.$field.'`.`'.$table.'`';
  }

  if (strpos($field, '.') !== false) {
    $field = explode('.', $field);
    return '`'.$field[0].'`.`'.$field[1].'`';
  } else {
    return '`'.$field.'`';
  }
}

/**
 * @param $field
 * @param $relation
 * @param $value
 *
 * @return string
 */
function _expr_($field, $relation, $value = '') {
  if (func_num_args() == 2) {
    $value = $relation;
    $relation = '=';
  }

  if (gettype($field) == 'object') {
    $field = $field->get();
  } else {
    $field = _field_($field);
  }

  return array('expr', $field, $relation, $value);
}

function _and_() {
  $arguments = func_get_args();
  $andArray = array('and');

  if (count($arguments) == 1 && gettype($arguments[0]) == 'array') {
    foreach ($arguments[0] as $arg) {
      $andArray[] = $arg;
    }
  } else {
    foreach ($arguments as $arg) {
      $andArray[] = $arg;
    }
  }

  return $andArray;
}

function _or_() {
  $arguments = func_get_args();
  $orArray = array('or');

  if (count($arguments) == 1 && gettype($arguments[0]) == 'array') {
    foreach ($arguments[0] as $arg) {
      $orArray[] = $arg;
    }
  } else {
    foreach ($arguments as $arg) {
      $orArray[] = $arg;
    }
  }

  return $orArray;
}

function _func_($expr, $field = '') {
  return new SFORMFunc($expr, $field);
}

function _value_($expr) {
  return new SFORMValue($expr);
}

function inset($value, $set) {
  $arr = explode(',', $set);
  return in_array($value, $arr);
}
