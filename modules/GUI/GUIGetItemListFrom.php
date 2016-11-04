<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGUIGetItemListFrom
{
  private $section;
  private $fields;
  private $databaseQuery;

  public function __construct($section) {
    $this->section = $section;
    $section = SFGUI::getSection($section);
    $this->fields = $section['fields'];
    $this->databaseQuery = SFORM::select()
      ->from($section['table']);

    return $this;
  }

  public function where($field, $value, $params) {
    foreach ($this->fields as $fieldItem) {
      if ($fieldItem['alias'] === $field) {
        $typeClass = SFGUI::getClassNameByType($fieldItem['type']);

        $typeClass::whereExpression($this->databaseQuery, $this->section, $field, $value, $params);
      }
    }

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

  public function exec() {
    return $this->databaseQuery->exec();
  }
}
