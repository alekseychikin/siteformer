<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMSelect extends SFORMWhere
  {
    private $select;
    private $from;
    private $fromTable;
    private $fromAlias = false;
    private $aliases = array();
    private $type;
    private $order;
    private $limit;
    private $join = array();
    private $joinJoins = array();
    private $hasManyConnections = false;
    private $subQuery = false;
    private $dropIds = true;
    private $having = '';

    public function __construct($select, $type)
    {
      // parent::__construct();
      $this->select = $select;
      $this->type = $type;
    }

    public function dropIds()
    {
      $this->dropIds = true;
      return $this;
    }

    public function getQuery($base = 'default', $subQuery = false)
    {
      $this->subQuery = $subQuery;
      $sql = 'SELECT ';
      if ($this->subQuery) {
        $sql .= 'DISTINCT ';
      }
      $fields = array();
      $mainTableFields = array();
      $primaryFields = array($this->fromTable => $this->getPrimaryFields($base, $this->fromTable));
      if (count($this->join) && !$this->subQuery) {
        foreach ($this->join as $join) {
          $primaryFields[$join['table']] = $this->getPrimaryFields($base, $join['table']);
        }
      }
      // echo 'primary'.N;
      // print_r($primaryFields);
      // die();
      if (gettype($this->select) == 'array') {
        foreach ($this->select as $table => $field) {
          $assoc = false;
          if (gettype($field) == 'array' && count($field) == 2) {
            $source = $field;
            list($field_, $field__) = each($source);
            list($assoc_, $assoc) = each($source);
          }
          if (gettype($field) == 'array') {
            list($table_, $field_) = each($field);
            $fields[] = $this->appendFieldToSelect($field_, $table_, $assoc);
            if ($table_ == $this->fromTable) {
              $mainTableFields[] = '`'.$field.'`';
            }
          }
          elseif (gettype($field) == 'object') {
            $fields[] = $field->get().' AS `'.$field->field().'`';
          }
          elseif (strpos($field, '.') !== false) {
            $table_ = substr($field, 0, strpos($field, '.'));
            $field_ = substr($field, strpos($field, '.') + 1);
            $fields[] = $this->appendFieldToSelect($field_, $table_, $assoc);
            if ($table_ == $this->fromTable) {
              $mainTableFields[] = ($assoc ? '`'. $assoc .'`' : '`'. $field .'`');
            }
          }
          else {
            $fields[] = $this->appendFieldToSelect($field);
            $mainTableFields[] = '`'.$field.'`';
          }
        }
        foreach ($primaryFields as $table_ => $fields_) {
          foreach ($fields_ as $field) {
            if ($table_ == $this->fromTable) {
              $mainTableFields[] = ($assoc ? '`'. $assoc .'`' : '`'. $field .'`');
            }
            if (count($this->join)) {
              $field = $this->appendFieldToSelect($field, $table_, $assoc);
            }
            else {
              $field = $this->appendFieldToSelect($field);
            }
            $fields[] = $field;
          }
        }
      }
      else {
          // echo (int)$this->subQuery.N;
          // echo (int)count($this->join).N;
        $fields_ = $this->getFields($this->selectTable, $base);
        if (count($this->join)) {
          foreach ($fields_ as $field) {
            if ($this->fromAlias !== false) {
              $fields[] = '`'.$this->fromAlias.'`.`'.$field.'` AS `'.$this->fromAlias.'.'.$field.'`';
            }
            else {
              $fields[] = '`'.$this->selectTable.'`.`'.$field.'` AS `'.$this->selectTable.'.'.$field.'`';
            }
            $mainTableFields[] = '`'. $field .'`';
          }
          foreach ($this->join as $join) {
            $fields_ = $this->getFields($join['table'], $base);
            foreach ($fields_ as $field) {
              if ($join['alias'] !== false) {
                $fields[] = '`'.$join['alias'].'`.`'.$field.'` AS `'.$join['alias'].'.'.$field.'`';
              }
              else {
                $fields[] = '`'.$join['table'].'`.`'.$field.'` AS `'.$join['table'].'.'.$field.'`';
              }
            }
          }
        }
        else {
          $fields[] = '*';
          $mainTableFields[] = '*';
        }
      }
      // print_r($mainTableFields);
      if ($this->fromAlias !== false) {
        $useTables = array($this->fromAlias);
      }
      else {
        $useTables = array($this->fromTable);
      }
      $fields = array_unique($fields);
      // if ($this->subQuery) {
      // $sql .= $this->fromTable.'.*'.N;
      // }
      // else {
      $sql .= implode(', ', $fields).N;
      // }
      if ($this->hasManyConnections) {
        $mainTableFields = array_unique($mainTableFields);
        // print_r($mainTableFields);
        $sql .= 'FROM (SELECT '.implode(', ', $mainTableFields).' FROM `'.$this->fromTable.'`'.N;
        if ($this->getById !== false) {
          $idField = $this->getPrimaryFields($base, $this->fromTable);
          $idField = $idField[0];
          $this->where = '`'. $this->fromTable .'`.`'. $idField .'` = '.$this->getById;
        }
        if ($this->where) {
          $sql .= 'WHERE '.$this->expandExpression($this->fromTable, $this->where).N;
        }
        if ($this->group) {
          $sql .= 'GROUP BY '.$this->group.N;
        }
        if ($this->having) {
          $sql .= 'HAVING '.$this->expandExpression($this->fromTable, $this->having).N;
        }
        if ($this->limit) {
          $sql .= 'LIMIT '.$this->limit.N;
        }
        $sql .= ') AS `'.$this->fromTable.'`'.N;
        foreach ($this->join as $join) {
          $sql .= $join['type'].' JOIN `'.$join['table'].'`';
          if ($join['alias'] !== false) {
            $sql .= ' AS `'.$join['alias'].'`';
          }
          $sql .= N;
          $sql .= 'ON '.$this->expandExpression($join['table'], $join['on']).N;
          if ($join['alias'] !== false) {
            $useTables[] = $join['alias'];
          }
          else {
            $useTables[] = $join['table'];
          }
        }
        if ($this->order) {
          $sql .= 'ORDER BY '.$this->order.N;
        }
      }
      else {
        $sql .= 'FROM '.$this->from.N;
        foreach ($this->join as $join) {
          $sql .= $join['type'].' JOIN `'.$join['table'].'`';
          if ($join['alias'] !== false) {
            $sql .= ' AS `'.$join['alias'].'`';
          }
          $sql .= N;
          $sql .= 'ON '.$this->expandExpression($join['table'], $join['on']).N;
          if ($join['alias'] !== false) {
            $useTables[] = $join['alias'];
          }
          else {
            $useTables[] = $join['table'];
          }
        }
        if ($this->getById !== false) {
          $idField = $this->getPrimaryFields($base, $this->fromTable);
          $idField = $idField[0];
          $this->where = '`'. $this->fromTable .'`.`'. $idField .'` = '.$this->getById;
        }
        if ($this->where) {
          $sql .= 'WHERE '.$this->expandExpression($this->fromTable, $this->where).N;
        }
        if ($this->group) {
          $sql .= 'GROUP BY '.$this->group.N;
        }
        if ($this->having) {
          $sql .= 'HAVING '.$this->expandExpression($this->fromTable, $this->having).N;
        }
        if ($this->order) {
          $sql .= 'ORDER BY '.$this->order.N;
        }
        if ($this->limit) {
          $sql .= 'LIMIT '.$this->limit.N;
        }
      }
      return array(
        'sql' => $sql,
        'useTables' => $useTables,
        'primaryFields' => $primaryFields
      );
    }

    public function joinJoins($firstField, $secondField = false)
    {
      if (!$secondField) {
        $fromTable = $firstField;
        $toTable = $this->fromTable;
        $this->joinJoins[$fromTable] = array('to' => array(
          'table' => $toTable
        ));
      }
      else {
        $fromTable = $this->getTableNameFromField($firstField);
        $fromField = $this->getFieldNameFromField($firstField);
        $toTable = $this->getTableNameFromField($secondField);
        $toField = $this->getFieldNameFromField($secondField);
        $this->joinJoins[$fromTable] = array('field' => $fromField, 'to' => array(
          'table' => $toTable,
          'field' => $toField
        ));
      }
      return $this;
    }

    public function execOne($base = 'default')
    {
      return $this->executeOne($base);
    }

    public function exec($base = 'default')
    {
      return $this->execute($base);
    }

    public function length($base = 'default')
    {
      $query = $this->getQuery($base);
      $sql = $query['sql'];
      $sourceResult = parent::query($sql, $base);
      return count($sourceResult);
    }

    public function get($field, $base = 'default')
    {
      $query = $this->getQuery($base);
      $sql = $query['sql'];
      $sourceResult = parent::query($sql);
      if (!count($sourceResult)) {
        return false;
      }
      return $sourceResult[0][$field];
    }

    public function getSql($base = 'default')
    {
      $query = $this->getQuery($base);
      return $query['sql'];
    }

    public function execute($base = 'default')
    {
      $query = $this->getQuery($base);
      $sql = $query['sql'];
      $useTables = $query['useTables'];
      $primaryFields = $query['primaryFields'];
      // echo $sql.N;
      $sourceResult = parent::query($sql, $base);
      if (count($useTables) == 1) {
        return $this->prepareData($sourceResult, $useTables);
      }
      $result = array();
      $subids = array();

      // print_r($sourceResult);
      // Array
      // (
      //     [0] => Array
      //         (
      //             [i1.id] => 20
      //             [i1.name] =>
      //             [i1.coeff_discharge] => 1.00
      //             [i1.type] => simple
      //             [ic.id] =>
      //             [ic.ingredient] =>
      //             [ic.sub_ingredient] =>
      //             [ic.coeff_discharge] =>
      //             [i2.id] =>
      //             [i2.name] =>
      //             [i2.coeff_discharge] =>
      //             [i2.type] =>
      //         )
      // )

      // print_r($useTables);
      // Array
      // (
      //     [0] => i1
      //     [1] => ic
      //     [2] => i2
      // )
      foreach ($sourceResult as $row) {
        $primary = $this->getValueByPrimaryFields($row, $base);
        if (!$primary) continue;
        if (!isset($result[$primary])) { // если запись новая
          // echo 'новая запись'.N;
          $appendRow = array();
          $appendSubRow = array();
          foreach ($useTables as $subtable) {
            if ($this->fromAlias !== false) {
              if ($subtable == $this->fromAlias) continue;
              $appendSubRow[$subtable] = array();
              $subids[$subtable] = array();
            }
            else {
              if ($subtable == $this->selectTable) continue;
              $appendSubRow[$subtable] = array();
              $subids[$subtable] = array();
            }
          }

          // echo $subtable.N;
          // i2

          // print_r($appendSubRow);
          // print_r($subids);
          // Array
          // (
          //     [ic] => Array
          //         (
          //         )
          //
          //     [i2] => Array
          //         (
          //         )
          //
          // )


          $hasRow = array();
          foreach ($row as $field => $value) {
            $table = $this->getTableNameFromField($field);
            $selectTable = $this->selectTable;
            if ($this->fromAlias !== false) {
              $selectTable = $this->fromAlias;
            }
            if (!isset($hasRow[$table])) {
              $hasRow[$table] = false;
            }
            if ($table == $selectTable) {
              $appendRow[$this->getFieldNameFromField($field)] = $value;
            }
            else { // append first subrow
              $value = trim($value);
              if ($value !== "") {
                $hasRow[$table] = true;
              }
              $appendSubRow[$this->getTableNameFromField($field)][$this->getFieldNameFromField($field)] = $value;
            }
          }
          // print_r($appendRow);
          // Array
          // (
          //     [id] => 20
          //     [name] =>
          //     [coeff_discharge] => 1.00
          //     [type] => simple
          // )

          // print_r($useTables);
          // Array
          // (
          //     [0] => i1
          //     [1] => ic
          //     [2] => i2
          // )

          // print_r($hasRow);
          // Array
          // (
          //     [i1] => 1
          //     [ic] =>
          //     [i2] =>
          // )

          foreach ($useTables as $subtable) {
            $subtableRealName = $subtable;
            if ($this->fromAlias !== false) {
              $subtableRealName = $this->aliases[$subtable];
              if ($subtable == $this->fromAlias) continue;
            }
            else {
              if ($subtable == $this->selectTable) continue;
            }
            if ($hasRow[$subtable]) {
              $primaryFields = $this->getPrimaryFields($base, $subtableRealName);
              $primaryValue = '';
              foreach ($primaryFields as $primaryField) {
                $primaryValue .= $appendSubRow[$subtable][$primaryField];
              }
              if (!in_array($primaryValue, $subids[$subtable])) {
                $subids[$subtable][] = $primaryValue;
                $appendRow[$subtable] = array($appendSubRow[$subtable]);
              }
              else {
                $appendRow[$subtable] = array();
              }
            }
            else {
              $appendRow[$subtable] = array();
            }
          }
          $result[$primary] = $appendRow;
        }
        else { // добавить в субтаблицы существующей записи
          $appendSubRow = array();
          foreach ($useTables as $subtable) {
            $subtableRealName = $subtable;
            if ($this->fromAlias !== false) {
              $subtableRealName = $this->aliases[$subtable];
              if ($subtable == $this->fromAlias) continue;
            }
            else {
              if ($subtable == $this->selectTable) continue;
            }
            $appendSubRow[$subtable] = array();
          }
          $hasRow = array();
          foreach ($row as $field => $value) {
            $table_ = $this->getTableNameFromField($field);
            if (!isset($hasRow[$table_])) {
              $hasRow[$table_] = false;
            }
            if ($table_ != $this->selectTable) {
              $value = trim($value);
              if ($value !== "") {
                $hasRow[$table_] = true;
              }
              $appendSubRow[$table_][$this->getFieldNameFromField($field)] = $value;
            }
          }
          foreach ($useTables as $subtable) {
            $subtableRealName = $subtable;
            if ($this->fromAlias !== false) {
              $subtableRealName = $this->aliases[$subtable];
              if ($subtable == $this->fromAlias) continue;
            }
            else {
              if ($subtable == $this->selectTable) continue;
            }
            $primaryFields = $this->getPrimaryFields($base, $subtableRealName);
            $primaryValue = '';
            foreach ($primaryFields as $primaryField) {
              $primaryValue .= $appendSubRow[$subtable][$primaryField];
            }
            if (!in_array($primaryValue, $subids[$subtable])) {
              $subids[$subtable][] = $primaryValue;
              if ($hasRow[$subtable]) {
                $result[$primary][$subtable][] = $appendSubRow[$subtable];
              }
            }
          }
        }
      }
      // print_r($result);
      $result = $this->prepareJoinJoins($result, $base);
      if ($this->dropIds) {
        $result = $this->doDropIds($result);
      }
      return $this->prepareData($result, $useTables);
    }

    private function doDropIds($res_)
    {
      $result = array();
      foreach ($res_ as $row) {
        $result[] = $row;
      }
      return $result;
    }

    public function hasManyConnections()
    {
      $this->hasManyConnections = true;
      return $this;
    }

    public function executeOne($base = 'default')
    {
      $this->limit(1);
      $result = $this->execute($base);
      if (count($result) > 0) {
        $result = each($result);
        return $result['value'];
      }
      return array();
    }

    public function prepareTable($table)
    {
      $this->selectTable = $table;
      return $this;
    }

    public function from($table, $alias = false, $base = 'default')
    {
      if (gettype($table) === 'string') {
        $this->from = '`' . $table . '`';
        if ($alias !== false) {
          $this->from .= ' AS `'.$alias.'`';
          $this->fromAlias = $alias;
          $this->aliases[$alias] = $table;
        }
        $this->fromTable = $table;
        if (!$this->selectTable) {
          $this->selectTable = $table;
        }
      }
      elseif (gettype($table) === 'object') {
        $query = $table->getQuery($base, true);
        $this->from = '(' . $query['sql'] . ') AS `' . $alias . '`'.N;
        $this->fromTable = $alias;
        $this->fromAlias = $alias;
        if (!$this->selectTable) {
          $this->selectTable = $base;
        }
      }
      return $this;
    }

    public function order($order)
    {
      $this->order = $order;
      return $this;
    }

    public function having($expr)
    {
      if (func_num_args() == 3) {
        $expr = _expr_(func_get_arg(0), func_get_arg(1), func_get_arg(2));
      }
      elseif (func_num_args() == 2) {
        $expr = _expr_(func_get_arg(0), '=', func_get_arg(1));
      }
      $this->having = $expr;
      return $this;
    }

    public function limit($limit)
    {
      $this->limit = $limit;
      return $this;
    }

    public function join($table, $on)
    {
      $type = 'LEFT';
      $alias = false;

      $types = array('left', 'right', 'inner');
      if (func_num_args() > 2) {
        if (in_array(strtolower(func_get_arg(2)), $types)) {
          $type = func_get_arg(2);
        }
        else {
          $alias = func_get_arg(2);
          $this->aliases[$alias] = $table;
        }
      }
      $this->join[] = array('table' => $table, 'on' => $on, 'type' => $type, 'alias' => $alias);
      // $this->join[] = array('table' => $table, 'on' => $on, 'type' => $type);
      return $this;
    }

    public function append($table, $on)
    {
      $type = 'LEFT';
      $alias = false;

      $types = array('left', 'right', 'inner');
      if (func_num_args() > 2) {
        if (in_array(strtolower(func_get_arg(2)), $types)) {
          $type = func_get_arg(2);
        }
        else {
          $alias = func_get_arg(2);
          $this->aliases[$alias] = $table;
        }
      }
      $this->join[] = array('table' => $table, 'on' => $on, 'type' => $type, 'alias' => $alias);
      // $this->join[] = array('table' => $table, 'on' => $on, 'type' => $type);
      $this->joinJoins($table);
      return $this;
    }

    private function getValueByPrimaryFields($row, $base = 'default')
    {
      $value = array();
      $primaryFields = $this->getPrimaryFields($base, $this->selectTable);
      // print_r($primaryFields);
      // Array
      // (
      //     [0] => id
      // )
      foreach ($primaryFields as $field) {
        if (isset($row[$field])) {
          $value[] = $row[$field];
        }
        elseif (isset($row[$this->selectTable.'.'.$field])) {
          $value[] = $row[$this->selectTable.'.'.$field];
        }
        elseif ($this->fromAlias !== false && isset($row[$this->fromAlias.'.'.$field])) {
          // echo $this->fromAlias.'.'.$field.N;
          // i1.id
          $value[] = $row[$this->fromAlias.'.'.$field];
        }
      }
      return implode(',', $value);
    }

    private function appendFieldToSelect($field, $table = '', $assoc = false)
    {
      if ($this->subQuery) {
        if ($table) {
          if ($this->fromTable == $table) {
            return '`'.$table.'`.`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$field.'`');
          }
          else {
            return '`'.$table.'`.`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$table.'.'.$field.'`');
          }
        }
        if (count($this->join)) {
          return '`'.$this->fromTable.'`.`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$field.'`');
        }
        else {
          return '`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$field.'`');
        }
      }
      else {
        if ($table) {
          return '`'.$table.'`.`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$table.'.'.$field.'`');
        }
        if (count($this->join)) {
          return '`'.$this->fromTable.'`.`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$this->fromTable.'.'.$field.'`');
        }
        else {
          return '`'.$field.'` AS '.($assoc ? '`'. $assoc .'`' : '`'.$field.'`');
        }
      }
    }

    private function prepareJoinJoins($result, $base = 'default')
    {
      foreach ($result as $id => $row) {
        foreach ($this->joinJoins as $fromTable => $joinsParam) {
          $to = $joinsParam['to'];
          if ($to['table'] == $this->fromTable) {
            $fields = array();
            if (gettype($this->select) == 'array') {
              $primaryFields = $this->getPrimaryFields($base, $fromTable);
              foreach ($primaryFields as $field) {
                if (!in_array($field, $fields)) {
                  $fields[] = $field;
                }
              }
              foreach($this->select as $field) {
                if ($this->getTableNameFromField($field) == $fromTable) {
                  $fields[] = $this->getFieldNameFromField($field);
                }
              }
            }
            else {
              $fields = $this->getFields($fromTable, $base);
            }
            if (!isset($result[$id][$fromTable])) {
              $result[$id][$fromTable] = array();
            }
            if (isset($row[$fromTable][0])) {
              $subrow = $row[$fromTable][0];
              unset($result[$id][$fromTable][0]);
              foreach ($fields as $field) {
                $result[$id][$fromTable][$field] = $subrow[$field];
              }
            }
            else {
              foreach ($fields as $field) {
                $result[$id][$fromTable][$field] = '';
              }
            }
          }
          else {
            foreach ($row[$fromTable] as $subrow) {
              $lookingValue = $subrow[$joinsParam['field']];
              foreach ($row[$to['table']] as $index => $toRow) {
                if ($toRow[$to['field']] == $lookingValue) {
                  foreach ($subrow as $subfield => $subvalue) {
                    $result[$id][$to['table']][$index][$fromTable . '.' . $subfield] = $subvalue;
                  }
                }
              }
            }
          }
        }
      }
      return $result;
    }

    private function prepareData($result, $useTables)
    {
      // foreach ($useTables as $index => $table) {
      //   if (isset($this->aliases[$table])) {
      //     $useTables[$index] = $this->aliases[$table];
      //   }
      // }
      $selectTable = $this->selectTable;
      if ($this->fromAlias !== false) {
        $selectTable = $this->fromAlias;
      }
      foreach ($result as $id => $row) {
        foreach ($useTables as $table) {
          $tableRealName = $table;
          if (isset($this->aliases[$table])) {
            $tableRealName = $this->aliases[$table];
          }
          if ($table == $selectTable) {
            if (isset(SFORM::$readModifiers[$tableRealName])) {
              foreach (SFORM::$readModifiers[$tableRealName] as $modifier) {
                if (!isset($row[$modifier[0]])) continue;
                if (gettype($modifier[2]) == 'string') {
                  $result[$id][$modifier[1]] = call_user_func($modifier[2], $row[$modifier[0]], $row);
                }
                elseif (gettype($modifier[2]) == 'object') {
                  $result[$id][$modifier[1]] = $modifier[2]($row[$modifier[0]], $row);
                }
              }
            }
          }
          else {
            foreach ($row[$table] as $key => $subrow) {
              if (!isset(SFORM::$readModifiers[$tableRealName])) continue;
              foreach (SFORM::$readModifiers[$tableRealName] as $modifier) {
                if (isset($subrow[$modifier[0]])) {
                  if (gettype($modifier[2]) == 'string') {
                    $result[$id][$table][$key][$modifier[1]] = call_user_func($modifier[2], $subrow[$modifier[0]], $subrow);
                  }
                  elseif (gettype($modifier[2]) == 'object') {
                    $result[$id][$table][$key][$modifier[1]] = $modifier[2]($subrow[$modifier[0]], $subrow);
                  }
                }
              }
            }
          }
        }
      }
      return $result;
    }
  }


?>
