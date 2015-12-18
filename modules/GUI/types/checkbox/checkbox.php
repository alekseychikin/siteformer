<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  require_once ENGINE . 'classes/validate.php';
  require_once ENGINE . 'classes/text.php';

  class SFTypeCheckbox extends SFType
  {
    public static function getSqlField($params)
    {
      $params = json_decode($params, true);
      $values = array();
      $defaultValues = array();
      foreach ($params['defaultData'] as $param) {
        $paramLabel = SFText::getTag($param['label']);
        $values[] = $paramLabel;
        if ($param['checked'] == "true") {
          $defaultValues[] = $paramLabel;
        }
      }
      return array(
        'type' => 'SET("' . implode('","', $values) . '")',
        'default' => implode(',', $defaultValues)
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
          'name' => 'defaultData',
          'minlength' => 1,
          'error' => 'Не заданы Флажки',
          'array' => array(
            array(
              'name' => 'label',
              'require' => true,
              'unique' => true,
              'error' => 'Имя флажка должно быть уникальным',
              'skip_row_if_empty' => true
            ),
            array(
              'name' => 'checked'
            )
          )
        )
      ), $params);
      return json_encode($params);
    }
  }
