<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiRecord extends SFRouterModel
{
  public static function get ($params) {
    if (isset($params['getLastId'])) {
      $collection = SFGUI::getCollection($params['collection']);

      return SFORM::lastId($collection['table']);
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
    $collection = SFGUI::getCollection($params['collection']);

    SFORM::update($collection['table'])
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
    $collection = SFGUI::getCollection($params['collection']);
    $fields = self::sortFields($collection['fields'], $data);

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::validateInsertData($params['collection'], $field, $data);
    }

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $newData[$field['alias']] = $className::prepareInsertData($params['collection'], $field, $data);
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

    $record = SFORM::insert($collection['table'])
      ->values($newData)
      ->exec('default', true);

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::postPrepareInsertData($collection, $field, $record, $data);
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
    $collection = SFGUI::getCollection($params['collection']);
    $fields = self::sortFields($collection['fields'], $data);

    $currentData = SFERM::getItem($params['collection'])
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::validateUpdateData($params['collection'], $field, $currentData, $data);
    }

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $newData[$field['alias']] = $className::prepareUpdateData($params['collection'], $field, $currentData, $data);
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

    $record = SFORM::update($collection['table'])
      ->values($newData)
      ->where('id', $id)
      ->exec();

    foreach ($fields as $field) {
      $className = SFERM::getClassNameByType($field['type']);
      $className::postPrepareUpdateData($params['collection'], $field, $newData, $data);
    }

    return $id;
  }
}
