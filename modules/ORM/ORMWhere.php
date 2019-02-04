<?php

require_once __DIR__ . '/ORM.php';
require_once __DIR__ . '/ORMDatabase.php';

class SFORMWhere extends SFORMDatabase {
  protected $where;
  protected $getById = false;
  protected $group;
  protected $selectTable;

  public function id($id) {
    $this->getById = $id;

    return $this;
  }

  public function where($expr) {
    if (func_num_args() == 3) {
      $expr = _expr_(func_get_arg(0), func_get_arg(1), func_get_arg(2));
    } elseif (func_num_args() == 2) {
      $expr = _expr_(func_get_arg(0), '=', func_get_arg(1));
    }

    $this->where = $expr;

    return $this;
  }

  public function group($group) {
    $this->group = $group;

    return $this;
  }

  protected function getTableNameFromField($field) {
    if (gettype($field) == 'object') {
      return $this->selectTable;
    }

    if (strpos($field, '.') !== false) {
      return str_replace('`', '', substr($field, 0, strpos($field, '.')));
    }

    return '';
  }

  protected function getFieldNameFromField($field) {
    if (strpos($field, '.') !== false) {
      return substr($field, strpos($field, '.') + 1);
    }

    return str_replace('`', '', $field);
  }


  protected function expandExpression($defaultTable, $exprs) {
    if (gettype($exprs) == 'array') {
      if ($exprs[0] == 'expr') {
        $table = $this->getTableNameFromField($exprs[1]);
        $field = $this->getFieldNameFromField($exprs[1]);

        if (gettype($exprs[3]) == 'object') {
          $value = $exprs[3]->get();
        } else {
          $value = parent::quote($exprs[3]);
        }

        if ($exprs[2] == 'FIND_IN_SET') {
          $result = ' FIND_IN_SET('.$value.', '._field_($exprs[1]).') > 0';
        } else {
          $result = ' '.$exprs[1].' '.$exprs[2].' '.$value.' ';
        }

        return $result;
      } elseif ($exprs[0] == 'or') {
        $orArray = array();

        for ($i = 1; $i < count($exprs); $i++) {
          $orArray[] = $this->expandExpression($defaultTable, $exprs[$i]);
        }

        return '('.implode(' OR ', $orArray).')';
      } elseif ($exprs[0] == 'and') {
        $andArray = array();

        for ($i = 1; $i < count($exprs); $i++) {
          $andArray[] = $this->expandExpression($defaultTable, $exprs[$i]);
        }

        return '('.implode(' AND ', $andArray).')';
      }
    }

    return $exprs;
  }
}
