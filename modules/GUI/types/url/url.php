<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';
require_once __DIR__ . '/../../GUIType.php';

class SFTypeUrl extends SFGUIType
{
  public static function validateSettings($params, $fields, $currentAlias) {
    return SFValidate::value([
      'source' => [
        'required' => true
      ]
    ], $params);
  }

  public static function prepareInsertData($section, $field, $data) {
    $section = SFGUI::getSection($section);
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
      ->from($section['table'])
      ->where($field['alias'], $value);

    $i = 1;
    $newValue = $value;

    while ($record->length()) {
      $newValue = $value . '-' . ++$i;
      $record = SFORM::select()
        ->from($section['table'])
        ->where($field['alias'], $newValue);
    }

    return $newValue;
  }

  public static function prepareUpdateData($section, $field, $currentData, $data) {
    $section = SFGUI::getSection($section);
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
      ->from($section['table'])
      ->where($field['alias'], $value)
      ->andWhere('id', '!=', $currentData['id']);

    $i = 1;
    $newValue = $value;

    while ($record->length()) {
      $newValue = $value . '-' . ++$i;
      $record = SFORM::select()
        ->from($section['table'])
        ->where($field['alias'], $newValue)
        ->andWhere('id', '!=', $currentData['id']);
    }

    return $newValue;
  }
}
