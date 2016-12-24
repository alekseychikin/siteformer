<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once ENGINE . 'classes/validate.php';

class SFTypeString extends SFType
{
  public static function validateSettings($params, $fields, $currentAlias) {
    $sources = self::getSources($fields, $params, $currentAlias);

    $params = parseJSON($params);
    $params = SFValidate::parse([
      [
        'name' => 'translit',
        'type' => 'bool'
      ],
      [
        'name' => 'removePunctuation',
        'type' => 'bool'
      ],
      [
        'name' => 'copyValueOf',
        'type' => 'bool'
      ],
      [
        'name' => 'copyValueOfValue',
        'valid' => function ($value, $source) use ($sources) {
          if (empty($value)) return true;
          if ($source['copyValueOf'] === 'false') return true;
          if (!in_array($value, $sources)) return false;

          return true;
        },
        'error' => 'Неизвестный или зацикленный источник'
      ]
    ], $params);

    return json_encode($params);
  }

  public static function prepareInsertData($section, $field, $data) {
    $settings = $field['settings'];

    $value = $data[$field['alias']];

    if (empty($value) && $settings['copyValueOf'] !== false) {
      $value = $data[$settings['copyValueOfValue']];
    }

    if ($settings['removePunctuation']) {
      $value = mb_strtolower(SFText::removeSpecialCharacters($value), 'utf-8');
    }

    if ($settings['translit']) {
      $value = SFText::translite($value);
    }

    return $value;
  }

  public static function whereExpression($databaseQuery, $section, $field, $value, $params) {
    if (isset($params['find'])) {
      if ($params['find'] === 'prefix') {
        $databaseQuery->where(SFORM::generateValue(':field LIKE ":value%" ', [
          'section' => $section,
          'field' => $field,
          'value' => $value
        ]));
      }
    } else {
      $databaseQuery->where($field, $value);
    }
  }

  private static function getSources($fields, $currentField, $currentAlias) {
    $sources = [];

    foreach ($fields as $field) {
      if ($field['type'] == 'string' && $currentAlias != $field['alias']) {
        $sources[] = $field['alias'];
      }
    }

    return $sources;
  }
}
