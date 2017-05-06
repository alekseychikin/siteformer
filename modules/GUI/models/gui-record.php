<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiRecord extends SFRouterModel
{
  public static function post ($params) {
    if (isset($params['delete'])) {
      return self::deleteItem($params);
    } elseif (isset($params['id'])) {
      return self::saveItem($params);
    } else {
      return self::createItem($params);
    }

    return true;
  }

  private static function deleteItem ($params) {
    $section = SFGUI::getSection($params['section']);

    SFORM::update($section['table'])
      ->values([
        'status' => 'deleted'
      ])
      ->where('id', $params['delete'])
      ->exec();
  }

  private static function createItem ($params) {
    $data = $params['data'];
    $status = $params['status'];
    $newData = ['status' => $params['status']];
    $section = SFGUI::getSection($params['section']);
    $fields = self::sortFields($section['fields']);

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $className::validateInsertData($params['section'], $field, $data);
    }

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $newData[$field['alias']] = $className::prepareInsertData($params['section'], $field, $data);
    }

    if ($status === 'public') {
      foreach ($fields as $field) {
        if ($field['required'] == "1" && (empty($newData[$field['alias']]))) {
          throw new ValidateException([
            'index' => [$field['alias']],
            'code' => 'EEMPTYREQUIREDVALUE'
          ]);
        }
      }
    }

    $record = SFORM::insert($section['table'])
      ->values($newData)
      ->exec('default', true);

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $className::postPrepareInsertData($section, $field, $record, $data);
    }

    return $record['id'];
  }

  private static function saveItem ($params) {
    $id = $params['id'];
    $data = $params['data'];
    $status = $params['status'];
    $newData = ['status' => $status];
    $section = SFGUI::getSection($params['section']);
    $fields = self::sortFields($section['fields']);

    $currentData = SFGUI::getItem($params['section'])
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $className::validateUpdateData($params['section'], $field, $currentData, $data);
    }

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $newData[$field['alias']] = $className::prepareUpdateData($params['section'], $field, $currentData, $data);
    }

    if ($status === 'public') {
      foreach ($fields as $field) {
        if ($field['required'] === true && (empty($newData[$field['alias']]))) {
          throw new ValidateException([
            'index' => [$field['alias']],
            'code' => 'EEMPTYREQUIREDVALUE'
          ]);
        }
      }
    }

    $record = SFORM::update($section['table'])
      ->values($newData)
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFGUI::getClassNameByType($field['type']);
      $className::postPrepareUpdateData($params['section'], $field, $newData, $data);
    }

    return $id;
  }

  private static function sortFields ($fields) {
    while (true) {
      $find = false;
      $lookingFor = false;
      $needSource = false;
      $mapIndexes = [];

      foreach ($fields as $index => $field) {
        $mapIndexes[$field['alias']] = $index;

        if ($lookingFor && $field['alias'] === $lookingFor) {
          array_splice($fields, $index, 1);
          array_splice($fields, $needSource, 0, array($field));
          $find = true;

          break;
        } else {
          $className = SFGUI::getClassNameByType($field['type']);

          if (method_exists($className, 'detectSource') && $className::detectSource($field)) {
            $lookingFor = $className::detectSource($field);
            $data[$field['alias']] = $data[$lookingFor];
            $needSource = $index;

            if (isset($mapIndexes[$lookingFor])) {
              $lookingFor = false;
            }
          }
        }
      }

      if (!$find) break;
    }

    return $fields;
  }
}
