<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../ERMType.php';

class SFTypeUrl extends SFERMType
{
  public static function validateSettings($settings, $fields, $currentAlias, $indexes = []) {
    return SFValidate::value([
      'source' => [
        'required' => true
      ]
    ], $settings, $indexes);
  }

  public static function prepareInsertData($collection, $field, $data) {
    $collection = SFERM::getCollection($collection);
    $settings = $field['settings'];

    if (empty($data[$field['alias']]) && empty($data[$settings['source']])) {
      return '';
    }

    $value = $data[$field['alias']];

    if (empty($value)) {
      $value = $data[$settings['source']];
    }

    $value = mb_strtolower(SFText::removeSpecialCharacters($value), 'utf-8');
    $value = SFText::translite($value);

    $record = SFORM::select()
      ->from($collection['table'])
      ->where($field['alias'], $value);

    $i = 1;
    $newValue = $value;

    while ($record->length()) {
      $newValue = $value . '-' . ++$i;
      $record = SFORM::select()
        ->from($collection['table'])
        ->where($field['alias'], $newValue);
    }

    return $newValue;
  }

  public static function prepareUpdateData($collection, $field, $currentData, $data) {
    $collection = SFERM::getCollection($collection);
    $settings = $field['settings'];

    if (empty($data[$field['alias']]) && empty($data[$settings['source']])) {
      return '';
    }

    $value = $data[$field['alias']];

    if (empty($value)) {
      $value = $data[$settings['source']];
    }

    $value = mb_strtolower(SFText::removeSpecialCharacters($value), 'utf-8');
    $value = SFText::translite($value);

    $record = SFORM::select()
      ->from($collection['table'])
      ->where($field['alias'], $value)
      ->andWhere('id', '!=', $currentData['id']);

    $i = 1;
    $newValue = $value;

    while ($record->length()) {
      $newValue = $value . '-' . ++$i;
      $record = SFORM::select()
        ->from($collection['table'])
        ->where($field['alias'], $newValue)
        ->andWhere('id', '!=', $currentData['id']);
    }

    return $newValue;
  }
}
