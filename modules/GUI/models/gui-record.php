<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiRecord extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['getLastId'])) {
      $section = SFGUI::getSection($params['section']);

      return SFORM::lastId($section['table']);
    }
  }

  public static function post ($params) {
    if (isset($params['delete'])) {
      self::deleteItem($params);
    } elseif (isset($params['id'])) {
      self::saveItem($params);
    } else {
      self::createItem($params);
    }
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
    SFGUI::login();

    $user = SFResponse::get('user');

    $data = $params['data'];
    $status = $params['status'];
    $newData = [
      'status' => $params['status'],
      'usercreate' => $user['id'],
      'datecreate' => gmdate('Y-m-d H:i:s')
    ];
    $section = SFGUI::getSection($params['section']);
    $fields = self::sortFields($section['fields'], $data);

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
  }

  private static function saveItem ($params) {
    SFGUI::login();

    $user = SFResponse::get('user');

    $id = $params['id'];
    $data = $params['data'];
    $status = $params['status'];
    $newData = [
      'status' => $status,
      'usermodify' => $user['id'],
      'datemodify' => gmdate('Y-m-d H:i:s')
    ];
    $section = SFGUI::getSection($params['section']);
    $fields = self::sortFields($section['fields'], $data);

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

  private static function sortFields ($fields, & $data) {
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
