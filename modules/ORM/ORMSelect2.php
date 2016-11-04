<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFORMSelect extends SFORMDatabase
{
  private $selectFields;
  private $fromTable;
  private $fromTableAlias;
  private $fieldsAliases = [];
  private $where = [];
  private $joins = [];
  private $joining = false;
  private $order = false;
  private $limit = false;
  private $offset = 0;

  public function __construct ($args) {
    $this->selectFields = $args;
  }

  public function from ($table) {
    $this->fromTable = $table;
    $this->fromTableAlias = $table;

    if (gettype($table) === 'object' && get_class($table) === 'SFORMSelect') {
      $this->fromTableAlias = 'u';
    }

    if (func_num_args() === 2) {
      $this->fromTableAlias = func_get_arg(1);
    }

    return $this;
  }

  public function append () {
    return $this;
  }

  public function join ($table, $alias = false) {
    if ($alias === false) {
      $alias = $this->getJoinAliasName($table);
    }

    $this->joins[$alias] = [
      'table' => $table,
      'on' => [],
      'alias' => $alias,
      'to' => $this->fromTableAlias
    ];
    $this->joining = $alias;

    return $this;
  }

  public function joinTo ($table, $tableTo, $alias = false) {
    if ($alias === false) {
      $alias = $this->getJoinAliasName($table);
    }

    $this->joins[$alias] = [
      'table' => $table,
      'on' => [],
      'alias' => $alias,
      'to' => $tableTo
    ];
    $this->joining = $alias;

    return $this;
  }

  public function on () {
    $params = func_get_args();

    if ($this->joining) {
      $this->joins[$this->joining]['on'][] = $this->handleExpression($params);
    }

    return $this;
  }

  public function openOn () {
    if ($this->joining) {
      $this->joins[$this->joining]['on'][] = '(';
    }

    return $this;
  }

  public function closeOn () {
    if ($this->joining) {
      $this->joins[$this->joining]['on'][] = ')';
    }

    return $this;
  }

  public function andOn () {
    $params = func_get_args();
    $this->joins[$this->joining]['on'][] = 'AND';
    $this->joins[$this->joining]['on'][] = $this->handleExpression($params);

    return $this;
  }

  public function orOn () {
    $params = func_get_args();
    $this->joins[$this->joining]['on'][] = 'OR';
    $this->joins[$this->joining]['on'][] = $this->handleExpression($params);

    return $this;
  }

  public function where () {
    $params = func_get_args();
    $this->where[] = $this->handleExpression($params);

    return $this;
  }

  public function andOpenWhere () {
    $this->where[] = ' AND (';

    return $this;
  }

  public function orOpenWhere () {
    $this->where[] = ' OR (';

    return $this;
  }

  public function openWhere () {
    $this->where[] = '(';

    return $this;
  }

  public function andWhere () {
    $params = func_get_args();
    $this->where[] = ' AND ';
    $this->where[] = $this->handleExpression($params);

    return $this;
  }

  public function closeWhere () {
    $this->where[] = ')';

    return $this;
  }

  public function orWhere () {
    $params = func_get_args();
    $this->where[] = ' OR ';
    $this->where[] = $this->handleExpression($params);

    return $this;
  }

  public function order ($order) {
    $order = explode(',', $order);
    $orders = [];

    foreach ($order as $item) {
      $item = explode(' ', trim($item));

      if (!isset($item[1])) {
        $item[1] = 'ASC';
      }

      $orders[] = $item;
    }

    $this->order = $orders;

    return $this;
  }

  public function limit ($param) {
    $this->limit = $param;

    if (func_num_args() === 2) {
      $this->offset = $param;
      $this->limit = func_get_arg(1);
    }

    return $this;
  }

  public function length ($alias = 'default') {
    $query = SFORM::select([SFORM::func('COUNT(*)'), 'length'])
      ->from($this)
      ->getQuery();

    $resultRaw = parent::query($query, $alias);
    if (isset($resultRaw[0]) && isset($resultRaw[0]['length'])) {
      return $resultRaw[0]['length'];
    }

    return 0;
  }

  public function exec ($alias = 'default') {
    $sql = $this->getQuery($alias);

    $resultRaw = parent::query($sql, $alias);

    $resultRaw = $this->prepareResult($resultRaw, $alias);

    $result = $this->dropIdKeys($resultRaw);

    return $result;
  }

  private function dropIdKeys ($resultRaw) {
    $result = [];

    foreach ($resultRaw as $id => $row) {
      foreach ($row as $key => $sub) {
        if (gettype($sub) === 'array') {
          $row[$key] = $this->dropIdKeys($sub);
        }
      }

      $result[] = $row;
    }

    return $result;
  }

  private function prepareResult ($resultRaw, $alias) {
    $result = [];

    foreach ($resultRaw as $row) {
      $id = $this->getIdByRow($row, $this->fromTable, $this->fromTableAlias, $alias);

      if (!isset($result[$id])) {
        $result[$id] = [];
      }

      foreach ($row as $field => $value) {
        $table = $this->fieldsAliases[$field]['table'];

        if ($table === $this->fromTableAlias) {
          $field = $this->cutOfTableAlias($field, $this->fromTableAlias);
          $result[$id][$field] = $value;
        }

        $this->prepareDataJoin(
          $alias,
          $result[$id],
          $row,
          $field,
          $value,
          $table,
          $this->fromTableAlias
        );
      }
    }

    return $result;
  }

  private function prepareDataJoin (
    $alias,
    & $result,
    $row,
    $field,
    $value,
    $table,
    $tableAlias
  ) {
    foreach ($this->joins as $join) {
      if ($join['to'] === $tableAlias) {
        $joinAlias = $join['alias'];

        if (!isset($result[$joinAlias])) {
          $result[$joinAlias] = [];
        }

        $id = $this->getIdByRow($row, $join['table'], $joinAlias, $alias);

        if (strlen($id)) {
          if (!isset($result[$joinAlias][$id])) {
            $result[$joinAlias][$id] = [];
          }

          if ($table === $joinAlias) {
            $field = $this->cutOfTableAlias($field, $joinAlias);
            $result[$joinAlias][$id][$field] = $value;
          }

          $this->prepareDataJoin(
            $alias,
            $result[$joinAlias][$id],
            $row,
            $field,
            $value,
            $table,
            $joinAlias
          );
        }
      }
    }
  }

  private function cutOfTableAlias ($field, $alias) {
    if (strpos($field, $alias) === 0) {
      return substr($field, strlen($alias) + 1);
    }

    return $field;
  }

  private function getIdByRow ($row, $table, $tableAlias, $alias) {
    $idFields = $this->getPrimaryFields($table, $alias);
    $id = [];

    foreach ($idFields as $field) {
      $id[] = $row[$this->getFieldInRow($field, $tableAlias)];
    }

    return implode(',', $id);
  }

  private function getFieldInRow ($field, $tableAlias) {
    return str_replace('`', '', $this->generateField($field, $tableAlias));
  }

  public function getQuery ($alias = 'default') {
    $fromTable = $this->fromTable;

    if (gettype($fromTable) === 'object' && get_class($fromTable) === 'SFORMSelect') {
      $fromTable = '(' . $fromTable->getQuery() . ')';
    } else {
      $fromTable = '`' . $fromTable . '`';
    }

    $sql = 'SELECT ';

    $sql .= $this->getSelectFields($alias);

    $sql .= N . 'FROM ' . $fromTable;

    if ($this->fromTable !== $this->fromTableAlias) {
      $sql .= ' AS `' . $this->fromTableAlias . '`';
    }

    foreach ($this->joins as $join) {
      $sql .= N . 'LEFT JOIN `' . $join['table'] . '`';

      if ($join['table'] !== $join['alias']) {
        $sql .= ' AS `' . $join['alias'] . '`';
      }

      $sql .= N . 'ON ' . $this->generateOn($join['on']);
    }

    if (count($this->where)) {
      $sql .= N . 'WHERE ' . $this->generateWhere();
    }

    if ($this->order !== false) {
      $sql .= N . 'ORDER BY ';
      $orders = [];

      foreach ($this->order as $order) {
        $orders[] = $this->generateField($order[0], $this->fromTableAlias) .
          ' ' . $order[1];
      }

      $sql .= implode(', ', $orders);
    }

    if ($this->limit !== false) {
      $sql .= N . 'LIMIT ' . $this->offset . ', ' . $this->limit;
    }

    return $sql;
  }

  private function generateWhere() {
    $result = '';

    foreach ($this->where as $option) {
      if (gettype($option) === 'array') {
        $result .= $this->generateField($option[0], $this->fromTableAlias, true) .
          ' ' . $option[1] . ' ' . $this->handleValue($option[2]);
      } else {
        $result .= $option;
      }
    }

    return $result;
  }

  private function generateOn ($params) {
    $result = '';

    foreach ($params as $option) {
      if (gettype($option) === 'array') {
        $result .= $this->generateField($option[0], $this->fromTableAlias, true) .
          ' ' . $option[1] . ' ' . $this->handleValue($option[2]);
      } else {
        $result .= $option;
      }
    }

    return $result;
  }

  public function selectFields () {
    $fields = [];

    foreach ($this->fieldsAliases as $field => $value) {
      $fields[] = $field;
    }

    return $fields;
  }

  private function getSelectFields ($alias = 'default') {
    $fields = [];

    if ($this->selectFields === '*') {
      if (
        gettype($this->fromTable) === 'object' &&
        get_class($this->fromTable) === 'SFORMSelect'
      ) {
        $tableFields = $this->fromTable->selectFields();

        foreach ($tableFields as $index => $field) {
          $tableFields[$index] = $this->fromTableAlias . '.' . $field;
        }
      } else {
        $tableFields = $this->getFields($this->fromTable, $alias);

        foreach ($this->joins as $joinAlias => $join) {
          $joinFields = $this->getFields($join['table']);

          foreach ($joinFields as $field) {
            $tableFields[] = $joinAlias . '.' . $field;
          }
        }
      }

      foreach ($tableFields as $field) {
        $fields[] = $this->generateSelectField($field, $this->fromTableAlias);
      }
    } else {
      $idFields = [];

      foreach ($this->selectFields as $field) {
        if (gettype($field) === 'array') {

          // field with alias
          $idFields[] = $this->generateField(
            $field[0],
            $this->fromTableAlias,
            true
          );
          $fields[] = $this->generateSelectField(
            $field[0],
            $this->fromTableAlias,
            $field[1]
          );
        } else {

          // field without alias
          $idFields[] = $this->generateField(
            $field,
            $this->fromTableAlias,
            true
          );
          $fields[] = $this->generateSelectField($field, $this->fromTableAlias);
        }
      }

      if (gettype($this->fromTable) !== 'object') {
        $fromIdFields = $this->getPrimaryFields($this->fromTable, $alias);

        foreach ($fromIdFields as $field) {
          if (!in_array(
            $this->generateField($field, $this->fromTableAlias, true),
            $idFields
          )) {
            $fields[] = $this->generateSelectField($field, $this->fromTableAlias);
          }
        }
      }

      foreach ($this->joins as $joinAlias => $joinTable) {
        $fromIdFields = $this->getPrimaryFields($joinTable['table'], $alias);

        foreach ($fromIdFields as $field) {
          if (!in_array(
            $this->generateField($field, $joinAlias, true),
            $idFields
          )) {
            $fields[] = $this->generateSelectField($field, $joinAlias);
          }
        }
      }
    }

    return implode(', ', $fields);
  }

  private function generateField ($srcField, $tableAlias, $dropAlias = false) {
    if (gettype($srcField) === 'object' && get_class($srcField) === 'SFORMFunc') {
      return $srcField->get();
    }

    if (
      isset($this->fieldsAliases[$srcField]) &&
      $this->fieldsAliases[$srcField]['table'] === $tableAlias &&
      !$dropAlias
    ) {
      return '`' . $srcField . '`';
    }

    $field = '';

    if (strpos($srcField, '.') !== false) {
      $field = '`' . substr($srcField, 0, strpos($srcField, '.')) . '`.`' .
        substr($srcField, strpos($srcField, '.') + 1) .'`';
    } else  {
      $field = '`' . $tableAlias . '`.`' . $srcField . '`';
    }

    return $field;
  }

  private function generateSelectField (
    $srcField,
    $tableAlias,
    $alias = false
  ) {
    $field = $this->generateField($srcField, $tableAlias, true);
    $fieldAlias = '';

    if ($alias !== false) {
      $fieldAlias .= '`' . $alias . '`';
    } else {
      if (strpos($srcField, '.') !== false) {
        $fieldAlias .= '`' . $srcField . '`';
      } else {
        $fieldAlias .= '`' . $tableAlias . '.' . $srcField . '`';
      }
    }

    if (gettype($srcField) !== 'object') {
      $this->registerFieldAlias($field, $fieldAlias);
    }

    return $field . ' AS ' . $fieldAlias;
  }

  private function registerFieldAlias ($field, $alias) {
    $field = explode('.', $field);
    $this->fieldsAliases[str_replace('`', '', $alias)] = [
      'table' => str_replace('`', '', $field[0]),
      'field' => str_replace('`', '', $field[1]),
    ];
  }

  private function handleExpression ($params) {
    $field = '';
    $rel = '';
    $value = '';

    if (count($params) === 2) {
      $field = $params[0];
      $rel = '=';
      $value = $params[1];
    } elseif (count($params) === 3) {
      $field = $params[0];
      $rel = $params[1];
      $value = $params[2];
    }

    return [$field, $rel, $value];
  }

  private function getJoinAliasName ($table) {
    $alias = $table;
    $i = '';

    while (isset($this->joins[$alias . $i])) {
      $i = gettype($i) === 'string' ? 2 : $i + 1;
    }

    return $table . $i;
  }

  private function handleValue ($value) {
    if (gettype($value) === 'object' && get_class($value) === 'SFORMField') {
      return $this->generateField($value->get(), $this->fromTableAlias, true);
    } elseif (is_numeric($value)) {
      return $value;
    }

    return $this->quote($value);
  }
}
