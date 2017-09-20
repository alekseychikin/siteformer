<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFERMType
{
  /**
  * Prepare database for this type. Maybe creating some tables would be needed.
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
      'null' => true,
      'default' => NULL
    ];
  }

  /**
  * Method returns validated settings
  * @param array $settings Params sent for validation
  * @param array $fields Array of fields at current SAMConnection
  * @param string $currentAlias Value of current alias
  * @return array Validated settings
  */
  public static function validateSettings($settings, $fields, $currentAlias) {
    return $settings;
  }

  /**
  * Method for validating data before preparing data and putting to the database
  * @param array $collection Collection
  * @param array $field Field
  * @param array $data Sent data
  */
  public static function validateInsertData($collection, $field, $data) {
    return true;
  }

  /**
  * Method for validating data before preparing data and update it at the database
  * @param array $collection Collection
  * @param array $field Field
  * @param array $data Sent data
  */
  public static function validateUpdateData($collection, $field, $data) {
    return true;
  }

  /**
  * Method for preparing data for putting to database
  * @param array $collection Collection
  * @param array $field Field
  * @param array $data Sent data
  * @return string Prepared data
  */
  public static function prepareInsertData($collection, $field, $data) {
    return $data[$field['alias']];
  }

  /**
  * Method for preparing data for update in database
  * @param array $collection Collection
  * @param array $field Field
  * @param array $currentData Current data
  * @param array $data Sent data
  * @return string Prepared data
  */
  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    return $data[$field['alias']];
  }

  /**
  * Method for adding some more data to another tables after insert record to main table
  * @param array $collection Collection
  * @param array $field Field
  * @param array $record Fresh inserted data to main table
  * @param array $data Origin array of data, sent to `prepareInsertData` before
  * @return void
  */
  public static function postPrepareInsertData($collection, $field, $record, $data) {
  }

  /**
  * Method for adding some more data or updating some data to another tables after update record to main table
  * @param array $collection Collection
  * @param array $field Field
  * @param array $newData Fresh updated data from main table
  * @param array $data Origin array of data, sent to `prepareUpdateData` before
  * @return void
  */
  public static function postPrepareUpdateData($collection, $field, $newData, $data) {
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

  public static function joinData($databaseQuery, $collection, $field) {
  }

  public static function postProcessData($collection, $field, $data) {
    return $data;
  }

  public static function whereExpression($collection, $field, $value, $params) {
    return [$field, $value];
  }
}
