<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFType
{
  /**
  * Prepare database for this type
  */
  public static function prepareDatabase() {
  }

  /**
  * @param array $settings Array of settings
  * @return array Data for sql field
  */
  public static function getSqlField($settings) {
    return [
      'type' => 'VARCHAR(250)',
      'null' => 'NULL',
      'default' => ''
    ];
  }

  /**
  * @param array $settings Params sended for validation
  * @param array $fields Array of fields at current SAMConnection
  * @param string $currentAlias Value of current alias
  * @return array Validated settings
  */
  public static function validateSettings($settings, $fields, $currentAlias) {
    return $settings;
  }

  /**
  * Method for preparing data for putting to database
  * @param array $field Field
  * @param array $data Sended data
  * @return string Prepared data
  */
  public static function prepareData($field, $data) {
    return $data[$field['alias']];
  }

  /**
  * Method for preparing data for output it to adding form
  * @param array $settings Settings of field
  * @return mixed Prepared data
  */
  public static function getDefaultData($settings) {
    return '';
  }

  /**
  * Method for preparing data for output it to editing form
  * @param mixed $value Value from additing or editing form
  * @param array $settings Settings of field
  * @return mixed Prepared data
  */
  public static function prepareDataForEditForm($value, $settings) {
    return $value;
  }

  public static function whereExpression($databaseQuery, $section, $field, $value, $params) {

  }
}
