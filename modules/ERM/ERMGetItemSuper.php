<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/../ORM/ORM.php';

class SFERMGetItemSuper
{
  protected $section;
  protected $fields;
  protected $databaseQuery;
  private static $systemFields = ['id', 'status'];

  public function __construct($section) {
    $this->section = SFERM::getSection($section);
    $this->fields = $this->section['fields'];
    $this->databaseQuery = SFORM::select()
      ->from($this->section['table']);

    foreach ($this->section['fields'] as $field) {
      $typeClass = SFERM::getClassNameByType($field['type']);
      $typeClass::joinData($this->databaseQuery, $this->section, $field);
    }

    return $this;
  }

  public function where($field, $value) {
    $params = false;

    if (func_num_args() === 3) {
      $params = func_get_arg(1);
      $value = func_get_arg(2);
    }

    if ($value = $this->getValueForORMQuery($field, $value, $params)) {
      call_user_func_array([$this->databaseQuery, 'where'], $value);
    }

    return $this;
  }

  public function andWhere($field, $value, $params = []) {
    if ($value = $this->getValueForORMQuery($field, $value, $params)) {
      call_user_func_array([$this->databaseQuery, 'andWhere'], $value);
    }

    return $this;
  }

  public function orWhere($field, $value, $params = []) {
    if ($value = $this->getValueForORMQuery($field, $value, $params)) {
      call_user_func_array([$this->databaseQuery, 'orWhere'], $value);
    }

    return $this;
  }

  public function andOpenWhere() {
    $this->databaseQuery->andOpenWhere();

    return $this;
  }

  public function orOpenWhere() {
    $this->databaseQuery->orOpenWhere();

    return $this;
  }

  public function openWhere() {
    $this->databaseQuery->openWhere();

    return $this;
  }

  public function closeWhere() {
    $this->databaseQuery->closeWhere();

    return $this;
  }

  public function order($order) {
    $this->databaseQuery->order($order);

    return $this;
  }

  public function limit($limit) {
    if (func_num_args() === 2) {
      $this->databaseQuery->limit($limit, func_get_arg(1));
    } else {
      $this->databaseQuery->limit($limit);
    }

    return $this;
  }

  public function getQuery($alias = 'default') {
    return $this->databaseQuery->getQuery($alias);
  }

  protected function execAndGetItems($alias = 'default') {
    $data = $this->databaseQuery->exec($alias);

    foreach ($data as $index => $row) {
      foreach ($this->fields as $field) {
        $typeClass = SFERM::getClassNameByType($field['type']);
        $row = $typeClass::postProcessData($this->section, $field, $row);
      }

      $data[$index] = $row;
    }

    return $data;
  }

  private function getValueForORMQuery($field, $value, $params = []) {
    foreach ($this->fields as $fieldItem) {
      if ($fieldItem['alias'] === $field) {
        $typeClass = SFERM::getClassNameByType($fieldItem['type']);

        $whereExpression = $typeClass::whereExpression($this->section, $field, $value, $params);

        return (gettype($whereExpression) === 'array' ? $whereExpression : [$whereExpression]);
      }
    }

    if (in_array($field, self::$systemFields)) {
      return $this->whereSystemField($field, $value);
    }

    return false;
  }

  private function whereSystemField($field, $value) {
    switch ($field) {
      case 'id':
        $this->databaseQuery->where($field, $value);

        break;
      case 'status':
        $this->databaseQuery->openWhere();

        foreach ($value as $index => $status) {
          if (!$index) {
            $this->databaseQuery->where($field, $status);
            continue;
          }

          $this->databaseQuery->orWhere($field, $status);
        }

        $this->databaseQuery->closeWhere();

        break;
    }
  }
}
