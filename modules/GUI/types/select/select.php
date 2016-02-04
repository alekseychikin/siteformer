<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeSelect extends SFType
{
  public static function getSqlField($params)
  {
    $params = json_decode($params, true);
    $values = array();
    $defaultValue = "";
    foreach ($params['defaultData'] as $index => $param) {
      $param = SFText::getTag($param);
      $values[] = $param;
      if ($params['defaultValue'] == $index) {
        $defaultValue = $param;
      }
    }
    if (empty($defaultValue)) {
      array_splice($values, 0, 0, $defaultValue);
    }
    return array(
      'type' => 'ENUM("' . implode('","', $values) . '")',
      'default' => $defaultValue
    );
  }

  public static function validateSettings($params, $fields, $currentAlias)
  {
    $params = json_decode($params, true);
    $params = SFValidate::parse(array(
      array(
        'name' => 'numOptions',
        'type' => 'uzint',
        'require' => true,
        'error' => 'Количество флажков должно быть больше нуля'
      ),
      array(
        'name' => 'defaultValue',
        'type' => 'int',
        'require' => true,
        'error' => 'Неизвестное значение по умолчанию'
      ),
      array(
        'name' => 'defaultData',
        'minlength' => 1,
        'error' => 'Не заданы Флажки',
        'array' => array(
          'require' => true,
          'unique' => true,
          'error' => 'Имя переключателя должно быть уникальным',
          'skip_row_if_empty' => true
        )
      )
    ), $params);
    if ($params['defaultValue'] == -1) {
      array_splice($params['defaultData'], 0, 0, "");
    }
    return json_encode($params);
  }
}
